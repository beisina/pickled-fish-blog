---
title: 元组
date: 2024-07-28
category: python
tag:
  - python
---

## 概念

元组（tuple）是一个`有序`，`可重复`的集合，可以存放任意数据类型，但是元组中的元素不能被修改，添加或删除。

## 创建元组

使用圆括号`()`来创建一个元组。若要创建一个只有一个元素的元组，需要在元素后加上逗号`,`。<br />
如果不加逗号，括号可能被当做是运算符，导致创建的不是元组，而是一个单独的对象。

```python
my_tuple1 = () # 空元组
my_tuple2 = (1, 2, 3)
my_tuple3 = (1,)
```

## 访问元素

与列表类似，访问元组元素也是通过索引和切片。

```python
my_tuple = ("a", "b", "c", "d", "e", "f", "g", "h")
print(my_tuple[0], my_tuple[3], my_tuple[-2])
# 输出：a d g
```

## 修改元素值

虽然元组本身是不可变的，当元组中存放可变数据类型元素的时候，那这个元素是可以改变的。

```python
my_tuple = ([1, 2, 3], 'hello', 100)
my_tuple[0][1] = 4
print(my_tuple)
# 输出：([1, 4, 3], 'hello', 100)
```

## 拼接元组

元组中的元素值是不允许修改的，但我们可以对元组进行连接组合，使用加号运算符来连接两个元组，返回一个新的元组。

```python
my_tuple1 = (1, 2, 3)
my_tuple2 = ('hello',)
my_tuple3 = my_tuple1 + my_tuple2
print(my_tuple3)
# 输出：(1, 2, 3, 'hello')
```

## 重复元组

使用乘号运算符`*`来将一个元组重复多次，返回一个新的元组。

```python
my_tuple1 = (1, 2, 3)
print(my_tuple1 * 3)
# 输出：(1, 2, 3, 1, 2, 3, 1, 2, 3)
```

## 比较元组

在Python中，元组可以通过比较运算符进行比较，这些比较操作的返回值通常是布尔值（True或False）。<br />
在比较时，两个元组会按照从左到右的顺序进行逐个元素的比较，如果两个元素不相等，则返回False，否则继续比较下一个元素。<br />
按索引依次比较对应元素：

1. 如不相等，则结果为元组比较的结果
2. 如相等，则比较下一对元素，直至有结果
3. 如所有对应元素都相等，则判为相等
4. 如果元组长度不同，而且小元组和大元组的前几项对应相等，则默认大元组大于小元组，与大元组剩余项的值无关
5. 如果是字符串比较，则比较字典序大小

如：

```python
my_tuple1 = (3,)
my_tuple2 = (1, 2, 3)
print(my_tuple1 > my_tuple2)
# 输出：True
# 3 > 1，直接返回True

my_tuple3 = (1, 2, 4)
my_tuple4 = (1, 2, 3)
print(my_tuple3 > my_tuple4)
# 输出：True
# 1与2比较，相等，继续；2与2比较，相等，继续；4 > 3，返回True
```

## 获取元素个数

可以使用 `len()`方法来获取元组中元素的个数。如：

```python
my_tuple1 = (1, 2, 3)
print(len(my_tuple))
# 输出：3
```

## 判断成员关系

使用`in`和`not in`来判断元素是否在元组中。

```python
my_tuple = (1, 2, 3, 4, 5)
# 判断元素是否在元组中
print(3 in my_tuple)  # 输出 True
print(6 in my_tuple)  # 输出 False

# 判断元素是否不在元组中
print(3 not in my_tuple)  # 输出 False
print(6 not in my_tuple)  # 输出 True
```
