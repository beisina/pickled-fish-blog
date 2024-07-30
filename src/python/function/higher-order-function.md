---
title: 高阶函数
date: 2024-07-30
category: python
tag:
  - python
---

## 概念

高阶函数是Python中一种强大的编程概念，它允许函数作为参数传递给其他函数，或者作为返回值从函数中返回。
在Python中，函数可以被当作变量一样进行操作，包括作为参数传递给其他函数，或者作为返回值从函数中返回。这种能够处理函数的函数就被称为高阶函数。简而言之，高阶函数就是能够接受函数作为参数或者返回函数的函数。

## 常见用法

高阶函数的几种常见用法：

- 函数作为参数传递
- 函数作为返回值返回
- 函数的嵌套定义

### 函数作为参数传递

```python
def square(x):
    return x * x

numbers = [1, 2, 3, 4, 5]
squares = map(square, numbers)
print(list(squares))  # 输出：[1, 4, 9, 16, 25]
```

> 内置函数map()来将一个函数应用到一个序列的每个元素上，生成一个新的序列
> 在上述例子中，square()函数作为参数传递给map()函数，用于将numbers列表中的每个元素平方。

### 函数作为返回值返回

可以在函数内部定义并返回另一个函数。这种用法常常用于创建闭包（closure），即一个带有捕获的外部变量的函数。
> 关于闭包，将在[装饰器](https://fishpot.yuque.com/org-wiki-fishpot-lbbnvp/python/nirwklr6x3iphq5q)的部分进行介绍

我们可以定义一个函数make_adder()，用于生成一个可以实现加法的函数：

```python
def make_adder(x):
    def add(y):
        return x + y
    return add

add_5 = make_adder(5)
print(add_5(3))  # 输出：8
```

在上面的例子中，make_adder()函数接受一个参数x，并返回一个新的函数add()，这个新的函数可以在执行时捕获到x的值，并与传入的参数y进行相加。

### 函数的嵌套定义

在Python中，函数可以在其他函数内部定义，这样的函数称为嵌套函数（nested function）。嵌套函数可以访问包含它的外层函数的变量，这种特性在高阶函数中经常被用到。
我们可以定义一个函数calculate()，它接受一个操作符作为参数，并返回一个执行相应操作的函数：

```python
def calculate(operator):
    def add(x, y):
        return x + y

    def subtract(x, y):
        return x - y

    def multiply(x, y):
        return x * y

    def divide(x, y):
        return x / y

    if operator == "+":
        return add
    elif operator == "-":
        return subtract
    elif operator == "*":
        return multiply
    elif operator == "/":
        return divide

addition = calculate("+")
print(addition(5, 3))  # 输出：8

subtraction = calculate("-")
print(subtraction(5, 3))  # 输出：2
```

在上面的例子中，calculate()函数返回了一个嵌套的函数，这个嵌套的函数可以执行不同的算术操作，具体由传入的参数决定。

## 常用内建函数

### map()

在刚才介绍函数作为参数传递时，提到了map函数。
map()函数接收两个参数，函数和一个可迭代对象，map将传入的函数依次作用到序列的每个元素，并把结果作为新的迭代器返回。
> 关于可迭代对象和迭代器，会在[迭代器和生成器](https://fishpot.yuque.com/org-wiki-fishpot-lbbnvp/python/dys4x2muczotxh2v)
> 部分介绍，现在简单将它理解为可以使用for循环遍历的一个对象，比如list。

这是另外一个求平方的函数，使用了lanbda匿名函数来定义：

```python
a = [1, -2, 3, -4, 5]
result = map(lambda x: x ** 2, a)  # 得到result为迭代器，需要遍历或转换来输出结果
print(list(result))  # 输出：[1, 4, 9, 16, 25]
# for i in result:
#     print(i)
```

### reduce()

reduce()和map()类似，接收两个参数，函数和一个可迭代对象的。reduce把结果继续和序列的下一个元素做累积计算。
例如，实现对一个序列求和：

```python
def add(x, y):
    return x + y

reduce(add, [1, 2, 3, 4, 5])
```

一些其他的用法，比如将上述序列转换成12345：

```python
def add(x, y):
    return x * 10 + y

reduce(add, [1, 2, 3, 4, 5])
```

### filter()

filter()接收一个函数和一个序列，filter()把传入的函数依次作用于每个元素，然后根据返回值是True还是False决定保留还是丢弃该元素。
下列过滤器用于过滤出奇数：若 x%2=1 则保留，即为奇数；若 x%2=0 则丢弃

```python
list1 = [1, 2, 3, 4, 5]
result = filter(lambda x: x % 2, list1)
print(list(result))
```

### sorted()

sorted()函数用于对序列进行排序，语法格式为`sorted(iterable, key=None, reverse=False)`，key可以对序列中的各个元素进行处理后再进行排序比较。
`reverse=False`表示升序排序，使用`reverse=False`可以实现降序排序。
举几个例子：

```python
## 默认排序
list1 = [3, 1, 5, 7, 9]
print(sorted(list1))
# 绝对值排序
list2 = [4, -7, 5, -11, 9]
print(sorted(list2, key=abs))
# 长度排序
list3 = ["a", "aaa", "aa", "aaaa"]
print(sorted(list3, key=len))
```

默认情况下，对字符串排序，是按照ASCII的大小比较的，字母的ASCII顺序为'AZa~z'。对于多类型字符串，顺序为：小写 > 大写 > 奇数 >
偶数。
sorted还可以对复合数据类型（元组，字典等）进行排序，具体的规则可以自行查询。

