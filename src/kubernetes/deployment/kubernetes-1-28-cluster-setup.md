---
title: k8s-1.28集群部署文档
date: 2024-07-31
category: kubernetes
tag:
  - kubernetes
---

## 环境说明

### 机器环境

```
master: 172.18.212.47 CentOS Linux release 7.9.2009 (Core)  4C/8G/200G
node1:  172.19.7.54   CentOS Linux release 7.9.2009 (Core)  24C/64G/500G
node2:  172.19.7.61   CentOS Linux release 7.9.2009 (Core)  24C/64G/500G
```

### 软件环境

```
kubernetes 1.28.2
docker 24.0.7
```

## 环境初始化

`所有步骤如无特殊说明，则默认所有机器执行`

### 修改机器IP，变成静态IP

以master机器为例：`vim /etc/sysconfig/network-scripts/ifcfg-ens160`

```latex
TYPE=Ethernet
BOOTPROTO=static
NAME=ens160
UUID=7a57afe8-4c78-4276-98b9-35cabe663351
DEVICE=ens160
ONBOOT=yes
IPADDR=172.18.212.47
NETMASK=255.255.252.0
GATEWAY=172.18.212.1
DNS1=114.114.114.114
```

### 设置机器主机名

```shell
# 在master上执行
hostnamectl set-hostname k8s-master && bash
# 在node-1上执行
hostnamectl set-hostname k8s-node-1 && bash
# 在node-2上执行
hostnamectl set-hostname k8s-node-2 && bash
```

### 配置hosts

配置hosts文件，通过主机名互相访问

```shell
sudo cat << EOF >> /etc/hosts
192.168.255.140 k8s-master
172.19.7.54 k8s-node1
172.19.7.61 k8s-node2
EOF
```

### 关闭selinux

```shell
# 临时关闭
setenforce 0
# 永久关闭
sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
# 修改selinux配置文件之后，重启机器，selinux配置才能永久生效
reboot -f
getenforce
# 显示Disabled说明selinux已经关闭
```

### 禁用firewalld和iptables

```shell
systemctl stop firewalld
systemctl disable firewalld

systemctl stop iptables
systemctl disable iptables
```

### 关闭交换分区

```shell
# 临时关闭
swapoff -a
# 永久关闭
vim /etc/fstab
# 将swap行注释掉
/dev/mapper/xxx    swap   xxx
```

### 调整内核参数

```shell
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

sysctl -p
modprobe br_netfilter
lsmod | grep br_netfilter
```

### 更新和配置yum源

```shell
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
yum clean all && yum makecache
sudo yum update -y
yum install -y yum-utils device-mapper-persistent-data lvm2 wget net-tools nfs-utils lrzsz gcc gcc-c++ make cmake libxml2-devel openssl-devel curl curl-devel unzip sudo ntp libaio-devel wget vim ncurses-devel autoconf automake zlib-devel  python-devel epel-release openssh-server socat ipvsadm conntrack ntpdate telnet
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# Ubuntu
```

### 配置ipvs功能

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
# 查看对应的模块是否加载成功
lsmod | grep -e ip_vs -e nf_conntrack_ipv4
# 重启
reboot -f
```

### 配置时间同步

```shell
# 跟网络时间做同步
ntpdate ntp.cloud.aliyuncs.com
# 添加计划任务
crontab -e 
# * * / 1 * * * /usr/sbin/ntpdate ntp.cloud.aliyuncs.com
# 重启crond服务
service crond restart
```

## 配置docker环境

### 移除原有docker环境

```shell
sudo yum remove docker \
     docker-client \
     docker-client-latest \
     docker-common \
     docker-latest \
     docker-latest-logrotate \
     docker-logrotate \
     docker-engine
```

### 安装docker环境

```shell
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 配置docker服务自启动

```shell
# 启动docker
systemctl start docker
# 设置docker开机启动
systemctl enable docker
# 验证
systemctl status docker
```

### 配置docker镜像加速

```shell
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://youraddr.mirror.aliyuncs.com", # 可选:配置自己的阿里云镜像加速地址
    "http://hub-mirror.c.163.com",
    "https://reg-mirror.qiniu.com",
    "https://docker.mirrors.ustc.edu.cn"
  ], 
  "insecure-registries": ["kubernetes-register.openlab.cn","harbor ip:port"],  # 写入harbor地址
  "exec-opts": ["native.cgroupdriver=systemd"]
}
EOF
```

### 配置cri-docker

kubernets 1.24版本后默认使用containerd做底层容器，需要使用cri-dockerd做中间层来与docker通信

```shell
# 下载
wget https://github.com/Mirantis/cri-dockerd/releases/download/v0.3.8/cri-dockerd-0.3.8-3.el7.x86_64.rpm
# 安装
rpm -ivh cri-dockerd-0.3.8-3.el7.x86_64.rpm
# 重载系统守护进程
systemctl daemon-reload
# 修改配置文件
vim /usr/lib/systemd/system/cri-docker.service
# 修改第10行 ExecStart
# 改为	
# ExecStart=/usr/bin/cri-dockerd --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.9 --container-runtime-endpoint fd://
```

### 配置cri-docker服务自启动

```shell
# 重载系统守护进程
systemctl daemon-reload
# 启动cri-dockerd
systemctl start cri-docker.socket cri-docker
# 设置cri-dockerd自启动
systemctl enable cri-docker.socket cri-docker
# 检查Docker组件状态
systemctl status docker cir-docker.socket cri-docker
# 测试 可选
docker run hello-world
```

## 配置k8s集群环境

### 安装kubectl

```shell
# 下载
curl -LO "https://dl.k8s.io/release/v1.28.2/bin/linux/amd64/kubectl"
# 检验 可选
curl -LO "https://dl.k8s.io/v1.28.2/bin/linux/amd64/kubectl.sha256"
echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
# 安装
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
# 测试
kubectl version --client
```

### 配置k8s组件源

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
yum makecache
```

### 安装

```shell
# 安装
yum install -y install kubeadm-1.28.2-0 kubelet-1.28.2-0 kubectl-1.28.2-0 --disableexcludes=kubernetes
# 如果报错未找到就试试不指定版本
yum install -y install kubeadm kubelet kubectl --disableexcludes=kubernetes
# 设置自启动
systemctl enable --now kubelet
```

## 集群初始化

### kubeadm init

仅在master节点执行

```shell
kubeadm init --kubernetes-version=v1.28.2 \
	--pod-network-cidr=10.224.0.0/16 \
	--apiserver-advertise-address=172.18.212.47 \
	--image-repository=registry.aliyuncs.com/google_containers \
	--cri-socket=unix:///var/run/cri-dockerd.sock
```

其中，apiserver-advertise-address替换为master节点ip

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

kubeadm join 172.18.212.47:6443 --token 3uc69h.n4oc8uepjjpd0bw4 \
        --discovery-token-ca-cert-hash sha256:c31136d1ba9c9354821b669a5ab72c46ec0bcd9dc3f6677a916a04fcaa7ae515
```

记下系统提示命令`kubectl join xxxxx`，并在后面追加`unix:///var/run/cri-dockerd.sock`

完整命令应该类似于：`kubeadm join 172.18.212.47:6443 --token xxx --discovery-token-ca-cert-hash sha256:xxx --cri-socket unix:///var/run/cri-dockerd.sock`

```shell
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### node节点加入集群

```shell
# 上面得到的命令
kubeadm join 172.18.212.47:6443 --token 3uc69h.n4oc8uepjjpd0bw4 \
        --discovery-token-ca-cert-hash sha256:c31136d1ba9c9354821b669a5ab72c46ec0bcd9dc3f6677a916a04fcaa7ae515 \
        --cri-socket unix:///var/run/cri-dockerd.sock
```

完成后应该能得到以下结果

```shell
# 在master上执行
kubectl get nodes
# NAME         STATUS     ROLES                  AGE  VERSION
# k8s-master   NotReady   control-plane,master   53m  v1.28.2
# k8s-node-1   NotReady   <none>                 1m   v1.28.2
# k8s-node-2   NotReady   <none>                 1m   v1.28.2
```

分配worker

```shell
# 在master上执行
kubectl label node k8s-node-1 node-role.kubernetes.io/worker=worker
kubectl label node k8s-node-2 node-role.kubernetes.io/worker=worker
```

### 安装Calico网络插件

```shell
# master执行
wget https://docs.projectcalico.org/manifests/calico.yaml
kubectl apply -f calico.yaml
# 验证
kubectl get nodes
# NAME         STATUS   ROLES           AGE    VERSION
# k8s-master   Ready    control-plane   2h     v1.28.2
# k8s-node-1   Ready    worker          1h     v1.28.2
# k8s-node-2   Ready    worker          1h     v1.28.2
```

## 安装Dashboard

以下命令均只在master节点上执行

### 下载安装

```shell
wget https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

修改Service部分，改为NodePort对外暴露端口

```yaml
kind: Service
apiVersion: v1
metadata:
  ...
spec:
  type: NodePort  # 改为NodePort
```

安装

```shell
kubectl apply -f recommended.yaml
```

### 查看

```shell
kubectl get pods,svc -n kubernetes-dashboard

NAME                                             READY   STATUS    RESTARTS   AGE
pod/dashboard-metrics-scraper-5657497c4c-x8srr   1/1     Running   0          3d22h
pod/kubernetes-dashboard-78f87ddfc-2b6rq         1/1     Running   0          3d22h

NAME                                TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)         AGE
service/dashboard-metrics-scraper   ClusterIP   10.109.73.125    <none>        8000/TCP        3d22h
service/kubernetes-dashboard        NodePort    10.101.254.225   <none>        443:30088/TCP   3d22h
```

### 创建账号

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

### 访问dashboard

```shell
# 获取端口
kubectl get svc -n kubernetes-dashboard
NAME                        TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)         AGE
dashboard-metrics-scraper   ClusterIP   10.109.73.125    <none>        8000/TCP        3d23h
kubernetes-dashboard        NodePort    10.101.254.225   <none>        443:30088/TCP   3d23h  # 端口为30088
```

浏览器访问集群ip:端口(https://172.18.212.47:30088/)，注意https

输入上一步获取到的token即可

## 安装Kuborad

任意节点执行，推荐master

```shell
sudo docker run -d \
  --restart=unless-stopped \
  --name=kuboard \
  -p 80:80/tcp \
  -p 10081:10081/tcp \
  -e KUBOARD_ENDPOINT="http://内网IP:80" \
  -e KUBOARD_AGENT_SERVER_TCP_PORT="10081" \
  -v /root/kuboard-data:/data \
  eipwork/kuboard:v3
  # 也可以使用镜像 swr.cn-east-2.myhuaweicloud.com/kuboard/kuboard:v3 ，可以更快地完成镜像下载。
  # 请不要使用 127.0.0.1 或者 localhost 作为内网 IP \
  # Kuboard 不需要和 K8S 在同一个网段，Kuboard Agent 甚至可以通过代理访问 Kuboard Server \
```

在浏览器输入 `http://your-host-ip:80` 即可访问 Kuboard v3.x 的界面，登录方式：

- 用户名： `admin`
- 密 码： `Kuboard123`

## 安装kubectl命令自动补全

```shell
yum install bash-completion -y
# 临时设置自动补全
source <(kubectl completion bash) 
# 永久设置自动补全
echo "source <(kubectl completion bash)" >> ~/.bashrc && bash
```

## 部署metric-server

### 下载

master执行

```yaml
wget https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.6.2/components.yaml
```

### 修改

`vim`修改140行左右

原：

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
    image: admin4j/metrics-server:v0.6.2  # 修改镜像仓库地址
```

### 应用

```shell
kubectl apply -f components.yaml
```

### 查看

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

## 常见问题

### kubeadm init

1. 检查环境初始化：swap，selinux，iptables，内核参数，ipvs
2. 检查docker环境：docker，cri-docker，docker服务自启动，docker驱动
3. init时是否指定socket：--cri-socket=unix:///var/run/cri-dockerd.sock
4. 初始化失败后删除相关文件，使用`kubeadm reset`重置

### k8s端口限制

#### 问题描述

创建Service时，小于30000的端口时会提示端口限制：

`The Service "envirment" is invalid: spec.ports[0].nodePort: Invalid value: 8098: provided port is not in the valid range. The range of valid ports is 30000-32767`

#### 解决方案

编辑api-server配置：`vim /etc/kubernetes/manifests/kube-apiserver.yaml`

40行左右

```yaml
spec:
  containers:
    - command:
      ...
      - --service-cluster-ip-range=10.96.0.0/12
      - --service-node-port-range=1-65535  # 添加这一行
```

完成后重启kubelet，`systemctl restart kubelet`

### kubeadm join

完整命令：`kubeadm join masterIP:6443 --token xxx --discovery-token-ca-cert-hash sha256:xxx --cri-socket unix:///var/run/cri-dockerd.sock`

在master执行，获取token和discovery-token-ca-cert-hash

```shell
# 获取 token 参数
kubeadm token list   # 查看已有token
kubeadm token create # 没有token则执行，创建新的 TOKEN

# 获取 discovery-token-ca-cert-hash 参数 
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null |  openssl dgst -sha256 -hex | sed 's/^.* //'
```
