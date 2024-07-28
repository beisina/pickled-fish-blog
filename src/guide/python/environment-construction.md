---
title: python环境搭建
date: 2022-01-10
category: python
tag:
  - python
---

## Windows系统Python下载与安装

访问官网[python.org](https://www.python.org/downloads/windows/)，下载最新版本的Python。
Python3.11.5的Windows exe安装包：[Python Release Python 3.11.5](https://www.python.org/downloads/release/python-3115/)
如果访问较慢，可以使用华为镜像来下载：[python-3.11.5.exe](https://mirrors.huaweicloud.com/python/3.11.5/python-3.11.5.exe)

## Linux系统Python下载与安装

以Centos7系统为例， Centos7系统自带Python2.7.5，这里将介绍yum安装Python3.6.8和源码安装Python3.11.4（任意版本）。
另外，本教程介绍如何将Python3升级到最新版本。

### yum安装Python3.6.8

```bash
# yum安装Python3
yum install python3 -y
# 查看Python版本
python3 -V
```

### 源码安装

#### 1. 安装依赖包

```bash
yum -y groupinstall "Development tools"
yum install -y ncurses-devel gdbm-devel xz-devel sqlite-devel tk-devel uuid-devel readline-devel bzip2-devel libffi-devel
yum install -y openssl-devel openssl11 openssl11-devel
```

#### 2. 配置openssl环境变量

```bash
export CFLAGS=$(pkg-config --cflags openssl11)
export LDFLAGS=$(pkg-config --libs openssl11)
```

#### 3. 下载Python3.11.4源码包

[官方下载](https://www.python.org/ftp/python/3.11.4/Python-3.11.4.tgz)
[华为镜像下载](https://mirrors.huaweicloud.com/python/3.11.4/Python-3.11.4.tgz)

```bash
# wget -P . https://www.python.org/ftp/python/3.11.4/Python-3.11.4.tgz
wget -P . https://mirrors.huaweicloud.com/python/3.11.4/Python-3.11.4.tgz
```

#### 4. 解压源码包

```bash
tar -zxvf Python-3.11.4.tgz
```

#### 5. 移动到指定目录

```bash
mv Python-3.11.4 /usr/local/python3.11
cd /usr/local/python3.11/
```

#### 6. 修改配置文件

```bash
# 如果没有vim，可以使用vi或使用命令 yum install vim -y 安装vim
vim Module/Setup
# 第147行，取消注释
_socket socketmodule.c
# 第215行，取消注释
_ssl _ssl.c $(OPENSSL_INCLUDES) $(OPENSSL_LDFLAGS) $(OPENSSL_LIBS)
# 第2176行，取消注释
_hashlib _hashopenssl.c $(OPENSSL_INCLUDES) $(OPENSSL_LDFLAGS) -lcrypto
```

#### 7. 编译安装

```bash
./configure --prefix=/usr/local/sbin/python3.11
make && make install
```

#### 8. 验证

```bash
/usr/local/sbin/python3.11/bin/python3 -V
```

#### 9. 修改软链接

```bash
# 删除原有软链接
rm -rf /usr/bin/python
rm -rf /usr/bin/pip
# 新建软连接
ln -sv /usr/local/sbin/python3.11/bin/python3 /usr/bin/python
ln -s /usr/local/sbin/python3.11/bin/pip3 /usr/bin/pip
```

#### 10. 修改yum配置文件

```shell
vim /usr/bin/yum
# 将第一行的 #!/usr/bin/python 改成 #!/usr/bin/python2.7
vim /usr/libexec/urlgrabber-ext-down
# 将第一行的 #!/usr/bin/python 改为 #!/usr/bin/python2.7
vim /usr/bin/yum-config-manager
# 将第一行的 #!/usr/bin/python 改为 #!/usr/bin/python2.7
```

## IDE

推荐使用PyCharm，下载地址：[Download PyCharm](https://www.jetbrains.com/pycharm/download/)

## HelloWorld

新建一个`helloworld.py`文件，写入内容：

```python
print("Hello World!")
```

使用cmd打开文件夹路径，输入`python helloworld.py`

```shell
C:\Users\User\Desktop\helloworld>python hellworld.py
Hello World!
```
