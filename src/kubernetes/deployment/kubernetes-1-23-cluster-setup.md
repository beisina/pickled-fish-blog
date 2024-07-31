---
title: k8s-1.23集群部署文档
date: 2024-07-31
category: kubernetes
tag:
  - kubernetes
---

## 环境说明

### 软件环境

- kubernetes 1.23.17
- docker 20.10.24

### 系统环境

- CentOS Linux 7 (Core)
- Ubuntu 22.04.3 LTS

## 清理环境

```shell
# 清理iptables
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
rm -rf /var/lib/etcd/*
# 清理CNI
rm -rf /etc/cni/*
# 清理ipvs
ipvsadm --clear
# 清理k8环境
kubeadm reset -f
modprobe -r ipip
rm -rf ~/.kube/
rm -rf /etc/kubernetes/
rm -rf /etc/systemd/system/kubelet.service.d
rm -rf /etc/systemd/system/kubelet.service
rm -rf /usr/bin/kube*
rm -rf /etc/cni
rm -rf /opt/cni
rm -rf /var/lib/etcd
rm -rf /var/etcd

# 卸载k8s软件包
# Centos
yum -y remove kubeadm* kubectl* kubelet*
# Ubuntu
apt purge -y kubeadm* kubectl* kubelet*

# 清理docker环境
docker volume rm etcd
rm -rf /var/etcd/backups/*
rm -f /etc/docker/daemon.json

docker kill $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi -f $(docker images -q)

# 卸载docker软件包
# Centos
yum remove -y docker docker-ce docker-client docker-selinux docker-buildx-plugin docker-engine nvidia-docker2
# Ubuntu
apt purge -y docker docker-ce nvidia-docker2 docker-buildx-plugin docker-engine

# 清理残留文件
rm -rf /var/etcd
rm -rf /var/lib/kubelet/
rm -rf /var/lib/rancher/
rm -rf /run/kubernetes/
rm /var/lib/kubelet/* -rf
rm /etc/kubernetes/* -rf
rm /var/lib/rancher/* -rf
rm /var/lib/etcd/* -rf
rm /var/lib/cni/* -rf
rm /var/lib/docker* -rf
rm /opt/docker/ -rf
rm /opt/lib/docker/ -rf
```

## 1 环境初始化

所有步骤如无特殊说明，则默认所有机器执行

### 1.1 配置静态IP

- CentOS

```shell
vim /etc/sysconfig/network-scripts/ifcfg-ens160

TYPE=Ethernet
BOOTPROTO=static
NAME=ens160
UUID=7a57afe8-4c78-4276-98b9-35cabe663351
DEVICE=ens160
ONBOOT=yes
IPADDR=172.18.212.47   # IP
NETMASK=255.255.252.0  # 子网掩码
GATEWAY=172.18.212.1   # 网关
DNS1=223.5.5.5         # DNS1
```

- Ubuntu

```shell
vim /etc/netplan/00-installer-config.yaml

# This is the network config written by 'subiquity'
network:
  ethernets:
    enp5s0:                               # 网卡名(使用ipaddr查看)
      dhcp4: no
      addresses: [172.19.7.101/20]        # IP
      gateway4: 172.19.15.254             # 网关
      nameservers:
        addresses: [223.5.5.5,223.6.6.6]  # DNS
  version: 2
```

### 1.2 设置机器主机名

```shell
# 在master上执行
hostnamectl set-hostname k8s-master && bash
# 在node-1上执行
hostnamectl set-hostname k8s-node-1 && bash
# 在node-2上执行
hostnamectl set-hostname k8s-node-2 && bash
...
```

### 1.3 配置hosts

配置hosts文件，通过主机名互相访问

```shell
cat >> /etc/hosts << EOF
172.18.212.47 k8s-master
172.19.1.98 k8s-node-1
172.19.1.99 k8s-node-2
...
EOF
```

### 1.4 关闭selinux

```shell
# 临时关闭
setenforce 0
# 永久关闭
sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
# 修改selinux配置文件之后，重启机器，selinux配置才能永久生效
reboot

# 检查
getenforce
# 显示Disabled说明selinux已经关闭
```

### 1.5 禁用firewalld和iptables

```shell
# Centos
systemctl stop firewalld && systemctl disable firewalld
# Ubuntu
ufw disable

systemctl stop iptables && systemctl disable iptables
```

### 1.6 关闭交换分区

```shell
# 临时关闭
swapoff -a
# 永久关闭
sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```

### 1.7 调整内核参数

```shell
# 修改linux的内核参数，添加网桥过滤和地址转发功能，转发IPv4并让iptables看到桥接流量
cat <<EOF | tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
# 加载网桥过滤模块
modprobe overlay
modprobe br_netfilter
# 编辑/etc/sysctl.d/kubernetes.conf文件，添加如下配置:
cat << EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
# 应用sysctl参数而不重新启动
sysctl -p

# 查看br_netfilter和 overlay模块是否加载成功
lsmod | grep -e br_netfilter -e overlay
# br_netfilter           22256  0 
# bridge                151336  1 br_netfilter
# overlay                91659  0
```

### 1.8 更新和配置软件源

- Centos

```shell
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
yum clean all && yum makecache
yum install -y yum-utils
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

- Ubuntu

```shell
apt -y install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL http://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] http://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable" # 按回车确定
```

### 1.9 配置ipvs功能

- Centos

```shell
# 安装ipset和ipvsadm
yum install ipset ipvsadmin -y

# 添加需要加载的模块写入脚本文件
cat <<EOF > /etc/sysconfig/modules/ipvs.modules
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack_ipv4
EOF
# 为脚本文件添加执行权限
chmod +x /etc/sysconfig/modules/ipvs.modules
# 执行脚本文件
/bin/bash /etc/sysconfig/modules/ipvs.modules
# 重启
reboot

# 查看对应的模块是否加载成功
lsmod | grep -e ip_vs -e nf_conntrack_ipv4
nf_conntrack_ipv4      15053  24 
nf_defrag_ipv4         12729  1 nf_conntrack_ipv4
ip_vs_sh               12688  0 
ip_vs_wrr              12697  0 
ip_vs_rr               12600  105 
ip_vs                 145497  111 ip_vs_rr,ip_vs_sh,ip_vs_wrr
nf_conntrack          139264  10 ip_vs,nf_nat,nf_nat_ipv4,nf_nat_ipv6,xt_conntrack,nf_nat_masquerade_ipv4,nf_nat_masquerade_ipv6,nf_conntrack_netlink,nf_conntrack_ipv4,nf_conntrack_ipv6
libcrc32c              12644  4 xfs,ip_vs,nf_nat,nf_conntrack
```

- Ubuntu

```shell
# 安装ipset和ipvsadm
apt install -y ipvsadm ipset

cat > /etc/modules-load.d/ipvs.conf << EOF
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack
EOF

# 重启
reboot

# 查看对应的模块是否加载成功
lsmod | grep -e ip_vs -e nf_conntrack
```

### 1.10 配置时间同步

- Centos

```shell
systemctl start chronyd && systemctl enable chronyd
```

- Ubuntu

```shell
# 安装服务
apt install -y chrony
# 启动chronyd服务
systemctl start chrony && systemctl enable chrony
```

## 2 配置docker环境

### 2.1 安装docker环境

- Centos

```shell
# 查看所有版本
yum list docker-ce --showduplicates

yum install -y docker-ce-20.10.24-3.el7 docker-ce-cli-20.10.24-3.el7
```

- Ubuntu

```shell
# 查看所有版本
apt-cache madison docker-ce

apt install -y docker-ce=5:20.10.24~3-0~ubuntu-jammy docker-ce-cli=5:20.10.24~3-0~ubuntu-jammy
```

> 如果这一步找不到软件包，检查步骤1.8是否执行正确

### 2.2 配置docker

```shell
mkdir /etc/docker -p

cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://youraddr.mirror.aliyuncs.com", # 配置自己的阿里云镜像加速地址
    "https://qwxrl8hj.mirror.aliyuncs.com",
    "http://hub-mirror.c.163.com",
    "https://reg-mirror.qiniu.com",
    "https://docker.mirrors.ustc.edu.cn"
  ], 
  "insecure-registries": ["harbor ip:port"],  # 写入harbor地址
  "exec-opts": ["native.cgroupdriver=systemd"],
  "data-root": "/opt/lib/docker"  # 配置合适的docke存储路径，目标文件夹需要手动创建，否则会报错
}
EOF
```

> 注意配置insecure-registries地址，否则拉取私有仓库会报https错误

### 2.3 配置docker服务自启动

```shell
# 启动docker并设置开机自启
systemctl enable --now docker
# 验证
systemctl status docker
```

## 3 配置k8s集群环境

### 3.1 配置k8s组件源

- Centos

```shell
cat <<EOF | tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
# 更新索引缓冲
yum makecache
```

- Ubuntu

```shell
apt install -y apt-transport-https
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add -

cat >/etc/apt/sources.list.d/kubernetes.list <<EOF 
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF

apt update
```

### 3.2 安装

- Centos

```shell
# 安装
yum install -y kubeadm-1.23.17-0 kubelet-1.23.17-0 kubectl-1.23.17-0 --disableexcludes=kubernetes

# 启动kubelet并设置开机自启
systemctl enable --now kubelet
```

- Ubuntu

```shell
# 查看所有版本
apt-cache madison kubeadm
# 安装
apt install -y kubelet=1.23.17-00 kubeadm=1.23.17-00 kubectl=1.23.17-00
# 设置自启动
systemctl enable kubelet
```

## 4 集群初始化

### 4.1 kubeadm init

仅在master节点执行

```shell
kubeadm init \
    --kubernetes-version=v1.23.17 \
	--pod-network-cidr=10.224.0.0/16 \
	--service-cidr=10.96.0.0/12 \
	--apiserver-advertise-address=172.18.212.47 \  # 集群masterIP
	--image-repository=registry.aliyuncs.com/google_containers
```

成功后会提示以下信息：

```shell
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 172.18.212.47:6443 --token nyjc81.tvhtt2h67snpkf48 \
        --discovery-token-ca-cert-hash sha256:cf8458e93e3510cf77dd96a73d39acd3f6284034177f8bad4d8452bb7f5f6e62 # 暂存这条命令
```

然后继续执行

```shell
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### 4.2 node节点加入集群

```shell
# 上面得到的命令
kubeadm join 172.18.212.47:6443 --token nyjc81.tvhtt2h67snpkf48 \
        --discovery-token-ca-cert-hash sha256:cf8458e93e3510cf77dd96a73d39acd3f6284034177f8bad4d8452bb7f5f6e62
```

如果成功，检查集群节点状态

```shell
# 在master上执行
kubectl get nodes

# NAME         STATUS     ROLES                  AGE  VERSION
# k8s-master   NotReady   control-plane,master   53m  v1.23.17
# k8s-node-1   NotReady   <none>                 1m   v1.23.17
# k8s-node-2   NotReady   <none>                 1m   v1.23.17
```

分配worker role

```shell
# 在master上执行
kubectl label node k8s-node-1 node-role.kubernetes.io/worker=worker
kubectl label node k8s-node-2 node-role.kubernetes.io/worker=worker
...
```

### 4.3 安装Calico网络插件

```shell
# master执行
kubectl apply -f https://docs.projectcalico.org/archive/v3.25/manifests/calico.yaml  # k8s 1.23适用此版本
# 验证 节点状态 NotReady => Ready
kubectl get nodes
# NAME         STATUS   ROLES           AGE    VERSION
# k8s-master   Ready    control-plane   2h     v1.23.17
# k8s-node-1   Ready    worker          1h     v1.23.17
# k8s-node-2   Ready    worker          1h     v1.23.172
```

### 4.4 k8s配置ipvs

```shell
kubectl edit configmap kube-proxy -n kube-system
# 修改配置
mode: "ipvs"

# 删除所有kube-proxy pod使之重启
kubectl delete pods -n kube-system -l k8s-app=kube-proxy
```

![image-20240112100835525.png](https://cdn.nlark.com/yuque/0/2024/png/35578695/1708682207799-d89cc978-8401-4081-9a10-0f943f4e19e8.png#averageHue=%23262322&clientId=u06adfa1a-1bad-4&from=ui&id=ucc3e3d11&originHeight=333&originWidth=369&originalType=binary&ratio=1&rotation=0&showTitle=false&size=30762&status=done&style=none&taskId=ud17cac08-c04b-40cd-b349-c2a99ef7da1&title=)
> GPU调度不配置IPVS会报错：nvidia-container-cli: device error: unknown device id: no-gpu-has-10MiB-to-run 无法分配GPU内存
> 根本原因是POD调度与自定义GPU调度器通信问题

## 5 常用软件

### 5.1 安装Dashboard

以下命令均只在master节点上执行

#### 下载安装

```shell
wget https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml\
# 修改Service部分，改为NodePort对外暴露端口
```

![2024-01-21_16-38-24.png](https://cdn.nlark.com/yuque/0/2024/png/35578695/1708682234341-70ce6dee-71f9-48d0-af64-a57cd7a7fbba.png#averageHue=%23272220&clientId=u06adfa1a-1bad-4&from=ui&id=ue8d48e2b&originHeight=358&originWidth=364&originalType=binary&ratio=1&rotation=0&showTitle=false&size=32318&status=done&style=none&taskId=u057a5525-7a1d-4d10-a9dc-08f29c2e53a&title=)<br />
安装

```shell
kubectl apply -f recommended.yaml
```

#### 查看

```shell
kubectl get pods,svc -n kubernetes-dashboard

NAME                                             READY   STATUS    RESTARTS   AGE
pod/dashboard-metrics-scraper-5657497c4c-x8srr   1/1     Running   0          3d22h
pod/kubernetes-dashboard-78f87ddfc-2b6rq         1/1     Running   0          3d22h

NAME                                TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)         AGE
service/dashboard-metrics-scraper   ClusterIP   10.109.73.125    <none>        8000/TCP        3d22h
service/kubernetes-dashboard        NodePort    10.101.254.225   <none>        443:30088/TCP   3d22h
```

#### 创建账号

创建dashboard-access-token.yaml文件

```yaml
# Creating a Service Account
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
---
# Creating a ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: admin-user
    namespace: kubernetes-dashboard
---
# Getting a long-lived Bearer Token for ServiceAccount
apiVersion: v1
kind: Secret
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
  annotations:
    kubernetes.io/service-account.name: "admin-user"
type: kubernetes.io/service-account-token
# Clean up and next steps
# kubectl -n kubernetes-dashboard delete serviceaccount admin-user
# kubectl -n kubernetes-dashboard delete clusterrolebinding admin-user
```

执行

```shell
kubectl apply -f dashboard-access-token.yaml
# 获取token
kubectl get secret admin-user -n kubernetes-dashboard -o jsonpath={".data.token"} | base64 -d
```

#### 访问dashboard

```shell
# 获取端口
kubectl get svc -n kubernetes-dashboard
NAME                        TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)         AGE
dashboard-metrics-scraper   ClusterIP   10.109.73.125    <none>        8000/TCP        3d23h
kubernetes-dashboard        NodePort    10.101.254.225   <none>        443:30088/TCP   3d23h  # 端口为30088
```

浏览器访问：`https://ClusterIP:PORT`注意https<br />页面中输入上一步获取到的token即可

### 5.2 安装Kuborad

任意节点执行，推荐master

```shell
sudo docker run -d \
  --restart=unless-stopped \
  --name=kuboard \
  -p 80:80/tcp \  # 可根据需要修改第一个暴露的port
  -p 10081:10081/tcp \  # 无特殊需要不建议修改
  -e KUBOARD_ENDPOINT="http://IP:PORT" \  # 部署在哪台机器就用什么IP:PORT
  -e KUBOARD_AGENT_SERVER_TCP_PORT="10081" \
  -v /root/kuboard-data:/data \  # 可根据需要修改第一个数据挂载路径
  swr.cn-east-2.myhuaweicloud.com/kuboard/kuboard:v3
```

浏览器访问 `http://IP:PORT`

- 用户名： `admin`
- 密 码： `Kuboard123`

### 5.3 安装kubectl命令自动补全

```shell
yum install -y bash-completion

# 临时设置自动补全
source <(kubectl completion bash) 
# 永久设置自动补全
echo "source <(kubectl completion bash)" >> ~/.bashrc && bash
```

### 5.4 部署metric-server

> 使用Kuboard可一键集成，无需手动部署

#### 下载

master执行

```yaml
wget https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.6.2/components.yaml
```

#### 修改

`vim`修改140行左右<br />原：

```yaml
containers:
  - args:
    ...
    image: k8s.gcr.io/metrics-server/metrics-server:v0.6.2
```

修改后：

```yaml
containers:
  - args:
    ...
    - --kubelet-insecure-tls  # 添加这一行
    image: registry.cn-hangzhou.aliyuncs.com/google_containers/metrics-server:v0.6.2  # 修改镜像仓库地址
```

#### 应用

```shell
kubectl apply -f components.yaml
```

#### 查看

```shell
[root@k8s-master ~]# kubectl top nodes
NAME         CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%   
k8s-master   276m         6%     3445Mi          44%       
k8s-node-1   202m         0%     11326Mi         17%       
k8s-node-2   204m         0%     14497Mi         22%   

[root@k8s-master kubernetes]# kubectl top pods
NAME                                        CPU(cores)   MEMORY(bytes)   
nginx-test-d5db944-6wqkw                    0m           14Mi            
rpa-llm-embedding-service-9477877dc-fzg88   1m           492Mi
```

### 5.5 kubectl inspect拓展

```shell
# 下载kubectl
curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.23.17/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/bin/kubectl
# 下载kubectl拓展
cd /usr/bin/
wget https://mirror.ghproxy.com/https://github.com/AliyunContainerService/gpushare-device-plugin/releases/download/v0.3.0/kubectl-inspect-gpushare
chmod u+x /usr/bin/kubectl-inspect-gpushare
# 使用
kubectl inspect gpushare
NAME            IPADDRESS     GPU0(Allocated/Total)  GPU1(Allocated/Total)  GPU2(Allocated/Total)  GPU Memory(GiB)
k8s-poc-node-3  172.19.7.101  16/24                  8/24                   0/24                   24/72
----------------------------------------------------------------------
Allocated/Total GPU Memory In Cluster:
24/72 (33%)  
# 宽展开
kubectl inspect gpushare -d
```

### 5.6 部署nfs

#### 服务器

```shell
# CentOS安装
yum -y install nfs-utils rpcbind
# Ubuntu安装
apt install -y nfs-kernel-server

# 创建文件共享目录
vim /etc/exports

/opt/nfs  172.168.1.0/24(rw,no_root_squash,no_all_squash,sync)
# 共享目录 共享IP的网段(共享权限)
# 可以使用*允许所有IP网段挂载

# 使NFS配置生效
exportfs -r

# CentOS启动NFS服务
systemctl enable --now nfs-server
# Ubuntu启动NFS服务
service nfs-kernel-server start && service nfs-kernel-server enable

# 查看本机共享的路径
showmount -e 127.0.0.1
```

> 权限参数说明<br />ro :该主机有只读权限<br />rw :该主机对共享目录有可读可写的权限<br />all_squash
> ：任何用户访问服务器都是匿名用户访问，相当于使用nobody用户访问该共享目录。<br />no_all_squash :
> 和all_squash相反，该选项默认设置<br />root_squash :将root用户及所属组都映射为匿名用户或用户组，为默认设置<br />
> no_root_squash ：root用户具有对根目录的完全管理访问权限<br />no_subtree_check：不检查父目录的权限<br />anonuid :
> 将远程访问的所有用户都映射为匿名用户，并指定该用户为本地用户<br />anongid :
> 将远程访问的所有用户组都映射为匿名用户组账户，并指定该匿名用户组账户为本地用户组账户<br />sync :
> 将数据同步写入内存缓冲区与磁盘中，效率底，但可以保证数据的一致性<br />async :将数据先保存在内存缓冲区中，必要时才写入磁盘

#### 客户端

```shell
# Centos安装
yum -y install rpcbind
# Ubuntu安装
apt install -y nfs-common

# 挂载
mount -t nfs -o rw nolock ip:/opt/nfs /opt/nfs

# 取消挂载
umount /opt/nfs
# 如果服务器NFS服务宕机，而客户端正在挂载使用时，客户端会出现df -h命令卡死。这时需要强制取消挂载
umount -lf /opt/nfs
```

### 5.7 安装Krew 和Kube-Capacity

#### 安装插件管理器Krew

```shell
# 下载压缩包
wget  https://mirror.ghproxy.com/https://github.com/kubernetes-sigs/krew/releases/latest/download/krew-linux_amd64.tar.gz

# 解压
tar -zxvf krew-linux_amd64.tar.gz

# 配置环境变量
vim  ~/.bashrc
....
export PATH="${PATH}:${HOME}/.krew/bin"
.....
# 重新bash
bash

# 验证
./krew-linux_amd64 version

OPTION            VALUE
GitTag            v0.4.4
GitCommit         343e657
IndexURI          https://github.com/kubernetes-sigs/krew-index.git
BasePath          /root/.krew
IndexPath         /root/.krew/index/default
InstallPath       /root/.krew/store
BinPath           /root/.krew/bin
DetectedPlatform  linux/amd64

# 安装
mv ./krew-linux_amd64 ./kubectl-krew
mv ./kubectl-krew /usr/local/bin/
# 验证
kubectl krew version

# 更新索引
kubectl krew update
kubectl krew info

# 使用
kubectl krew search
NAME                            DESCRIPTION                                         INSTALLED
access-matrix                   Show an RBAC access matrix for server resources     no
accurate                        Manage Accurate, a multi-tenancy controller         no
advise-policy                   Suggests PodSecurityPolicies and OPA Policies f...  no
...
```

#### 安装资源使用量终端管理工具resource-capacity

> resource-capacity依赖metrics-server获取数据

```shell
# 这一步可能失败 需要从GitHub下载文件 多试几次
kubectl krew install resource-capacity
```

#### 使用resource-capacity

- 查看节点情况

```shell
kubectl resource-capacity
NODE         CPU REQUESTS   CPU LIMITS      MEMORY REQUESTS   MEMORY LIMITS
*            27568m (34%)   52560m (65%)    54516Mi (27%)     57008Mi (28%)
k8s-master   1212m (30%)    270m (6%)       570Mi (7%)        390Mi (5%)
k8s-node-1   2248m (28%)    3460m (43%)     3788Mi (11%)      3708Mi (11%)
...
```

- 查看POD

```shell
kubectl resource-capacity --pods

NODE         NAMESPACE       POD                                                       CPU REQUESTS   CPU LIMITS      MEMORY REQUESTS   MEMORY LIMITS
*            *               *                                                         27568m (34%)   52560m (65%)    54516Mi (27%)     57008Mi (28%)

k8s-master   *               *                                                         1212m (30%)    270m (6%)       570Mi (7%)        390Mi (5%)
k8s-master   kube-system     calico-kube-controllers-64cc74d646-f5z2t                  0m (0%)        0m (0%)         0Mi (0%)          0Mi (0%)
...
```

- 宽输出

```shell
kubectl resource-capacity --pods --util

NODE         NAMESPACE       POD                                                       CPU REQUESTS   CPU LIMITS      CPU UTIL     MEMORY REQUESTS   MEMORY LIMITS   MEMORY UTIL
*            *               *                                                         27568m (34%)   52560m (65%)    1303m (1%)   54516Mi (27%)     57008Mi (28%)   57538Mi (28%)

k8s-master   *               *                                                         1212m (30%)    270m (6%)       316m (7%)    570Mi (7%)        390Mi (5%)      3401Mi (44%)
k8s-master   kube-system     calico-kube-controllers-64cc74d646-f5z2t                  0m (0%)        0m (0%)         4m (0%)      0Mi (0%)          0Mi (0%)        21Mi (0%)
...
```

> 来自 pod 的利用率数字可能不会与总节点利用率相加。
> 与节点和集群级别数字代表 pod 值总和的请求和限制数字不同，节点指标直接来自指标服务器，并且可能包括其他形式的资源利用率。

- 排序

```shell
kubectl resource-capacity --util --sort cpu.util

[root@k8s-master ~]# kubectl resource-capacity --util --sort cpu.util
NODE         CPU REQUESTS   CPU LIMITS      CPU UTIL     MEMORY REQUESTS   MEMORY LIMITS   MEMORY UTIL
*            27568m (34%)   52560m (65%)    1416m (1%)   54516Mi (27%)     57008Mi (28%)   57583Mi (28%)
k8s-master   1212m (30%)    270m (6%)       315m (7%)    570Mi (7%)        390Mi (5%)      3403Mi (44%)
k8s-node-1   2248m (28%)    3460m (43%)     280m (3%)    3788Mi (11%)      3708Mi (11%)    15599Mi (48%)
...
```

- 显示 Pod 计数

```shell
kubectl resource-capacity --pod-count

NODE         CPU REQUESTS   CPU LIMITS      MEMORY REQUESTS   MEMORY LIMITS   POD COUNT
*            27568m (34%)   52560m (65%)    54516Mi (27%)     57008Mi (28%)   69/770
k8s-master   1212m (30%)    270m (6%)       570Mi (7%)        390Mi (5%)      13/110
k8s-node-1   2248m (28%)    3460m (43%)     3788Mi (11%)      3708Mi (11%)    17/110
...
```

- 标签过滤

```shell
kube-capacity --pod-labels app=nginx  
kube-capacity --namespace 默认
kube-capacity --namespace-labels team=api  
kube-capacity --node-labels kubernetes.io/role=node
```

## 6 常见问题

### 6.1 k8s端口限制

> 非必要不推荐修改

#### 问题描述

创建Service时，小于30000的端口时会提示端口限制：<br />`The Service "envirment" is invalid: spec.ports[0].nodePort: Invalid value: 8098: provided port is not in the valid range. The range of valid ports is 30000-32767`

#### 解决方案

编辑api-server配置：`vim /etc/kubernetes/manifests/kube-apiserver.yaml`<br />40行左右

```yaml
spec:
  containers:
    - command:
      ...
      - --service-cluster-ip-range=10.96.0.0/12
      - --service-node-port-range=1-65535  # 添加这一行
```

完成后重启kubelet，`systemctl restart kubelet`

### 6.2 kubeadm join忘记token/token过期

完整命令：`kubeadm join masterIP:6443 --token xxx --discovery-token-ca-cert-hash sha256:xxx`<br />
在master执行，获取token和discovery-token-ca-cert-hash

```shell
# 获取 token 参数
# 查看已有token
kubeadm token list
TOKEN     TTL         EXPIRES                USAGES                   DESCRIPTION                            
aaa.aaa   5h          2024-01-12T07:38:58Z   authentication,signing   The default bootstrap token generated by 'kubeadm init'. 
# 没有token则执行，创建新的 TOKEN并打印 join 语句
kubeadm token create --print-join-command

# 获取 discovery-token-ca-cert-hash 参数 
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null |  openssl dgst -sha256 -hex | sed 's/^.* //'

# 替换token参数和cert-hash参数
kubeadm join masterIP:6443 --token aaa.aaa --discovery-token-ca-cert-hash sha256:xxxxx
```
