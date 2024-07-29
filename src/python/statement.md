---
title: 控制语句
date: 2024-07-29
category: python
tag:
  - python
next: /python/basic-data-type/bool-and-numbers
---

## 程序设计的基本结构

任何算法(程序)都可以由顺序结构、选择结构、循环结构，这3种基本结构组成来实现，顺序结构是程序的基础。

- 顺序结构
- 选择结构
- 循环结构

## 顺序结构

顺序结构是基础。顺序结构是按照线性顺序自上而下依次执行的一种运行方式。

## 选择结构

选择结构又称为分支结构，是根据给定的条件是否成立来决定程序的执行流程。

### 单分支

单分支语句的语法格式如下：

```python
if 条件表达式:
    执行语句
```

- 条件表达式可以是关系表达式、逻辑表达式、算术表达式等。
- 执行语句可以是单个语句，也可以是多个语句组成的语句块，但多个语句的缩进必须一致。
- 当条件表达式的值为False时，不执行if后的语句，直接转到if语句的结束点。

如：

```python
a = 10
if a > 5
print("a>5")
# 输出结果：a>5
```

### 双分支语句

双分支语句的语法格式如下：

```python
if 条件表达式:
	执行语句1
else:
	执行语句2
```

与单分支语句不同的是，如果条件表达式不满足，则会执行else下的执行语句2。<br />如：

```python
a = 1
if a > 5:
print("a>5")
else:
    print("a<=5")
# 输出结果：a<=5
```

### 多分支语句

多分支语句的语法格式如下：

```python
if 条件表达式1:
	执行语句1
elif 条件表达式2:
	执行语句2
elif 条件表达式n:
	执行语句n
else:
	执行语句
```

其中，else可以不写。<br />该语句的作用就是根据不同条件表达式的值确定执行不同的语句。<br />如：

```python
score = 85
if 90 <= score < 100:
    print("成绩优秀")
elif 80 <= score < 90:
    print("成绩良好")
elif 60 <= score < 80:
    print("成绩一般")
elif 0 <= score < 60:
    print("成绩不及格")
```

### if语句的嵌套

在if语句中，可以嵌套新的if语句，但是要注意代码缩进。一个简单的嵌套格式如下：

```python
if 条件表达式1:
    执行语句1
    if 条件表达式2:
        执行语句2
    elif 条件表达式3:
        执行语句3
    else:
        执行语句4
elif 条件表达式4:
    执行语句5
else:
    执行语句6
```

## 循环结构

循环结构是在一定条件下反复执行某段程序的流程结构。

### for循环

for循环的语法格式如下：

```python
for 元素 in 集合:
    执行语句1
else:
    执行语句2
```

使用for循环来依次读出集合中的每一个元素并执行语句；如果全部读取完毕，则退出循环。<br />在很多情况下，不用写else，直接使用for循环。如：

```python
for i in range(10):
    print(i,end='')
# 输出结果：12345678910
```

其中，i是一个临时变量，作用是依次接收集合中的每一个元素；range(10)表示创建一个0~10（不包括10）的整数列表。<br />
还可以使用字符串作为集合输出。如：

```python
for i in "hello":
    print(i,end=' ')
# 输出结果：h e l l o
```

### while循环

while循环的语法格式如下：

```python
while 条件表达式:
    执行语句1
else:
    执行语句2
```

当条件表达式的值为True时，循环执行语句1直到条件表达式为False为止。<br />
如果条件表达式的值永远为True，则循环语句将会永远执行下去，直到使用其他方法终止程序。<br />如：

```python
i = 0
while i < 5:
    print("hello",end=' ')
    i = i +1
# 输出结果：hello hello hello hello hello
```

## 其他控制语句

### break

break语句用来终止循环语句，即循环条件没有False，break语句可以用在while和for循环中。<br />
如果使用嵌套循环，break语句将停止执行最深层的循环，并开始执行下一行代码。<br />如：

```python
for i in "hello":
    if i == "l":
        break
    print(i, end=' ')
# 输出结果：h e
```

当`i=='l'`时，执行break语句，终止循环，不再读入字符

### continue

continue 语句用来告诉Python跳过当前循环的剩余语句，然后继续进行下一轮循环。同样的，continue语句可以用在while和for循环中。

```python
for i in "hello":
    if i == "e":
        continue
    print(i, end=' ')
# 输出结果：h l l o
```

当`i=='l'`时，执行continue语句，终止本次循环，不再读入本次循环的字符，直接进行下一次循环

### pass

pass语句是空语句，不做任何事情，用作占位符来保持程序结构的完整性。

