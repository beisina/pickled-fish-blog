---
title: 列表
date: 2022-01-10
category: python
tag:
  - python
---

## 概念

列表（list）是一个有序且可更改的集合，可以存放任意数据类型，包括列表本身。使用方括号`[ ]`来创建一个列表。

```python
list1 = [1, 3.14, "hello", [1, 2, 3]]
```

与字符串的索引一样，列表索引从0开始。列表可以进行截取、组合等。

## 列表的转换

可以使用工厂函数把其他数据类型转化为list，要求原数据类型是可迭代对象（即能被for循环遍历的），如list、tuple、dict、set、str。

```python
list1 = list("abc")
print(list1, type(list1))
# 输出：['a', 'b', 'c'] <class 'list'>
```

## 访问列表元素

### 索引

与字符串类似，列表可以通过下标访问列表中的元素，下标从0开始计数。列表支持正向索引、负向索引。

```python
list1 = ["a", "b", "c", "d", "e", "f", "g", "h"]
print(list1[0], list1[3], list1[-2])
# 输出：a d g
```

### 切片

切片是通过下标访问列表中的元素，切片可以取出一个子列表。<br />语法格式：

```python
list [ start : end : step ]
```

- start表示切片的开始位置，默认为0。
- end表示切片的终止位置（但不包含该位置的元素），默认为列表的长度。
- step为切片的步长，默认为1，当省略步长时，可以同时省略后一个冒号;当步长为负数时，表示从end向start取值。

如：

```python
list1 = ["a", "b", "c", "d", "e", "f", "g", "h"]
print(list1[0:5])
print(list1[6:3:-1])
# 输出：
# ['a', 'b', 'c', 'd', 'e']
# ['g', 'f', 'e']
```

还可以使用`slice()`函数来切片。语法格式和上面的切片方式类似。

```python
list1 = ["a", "b", "c", "d", "e", "f", "g", "h"]
x = slice(0, 8, 3)
print(list1[x])
# 输出：['a', 'd', 'g']
```

### 遍历列表

使用 `for` 循环来遍历列表项：

```python
list1 = ["a", "b", "c", "d", "e", "f", "g", "h"]
for i in list1:
print(i, end=' ')
# 输出：a b c d e f g h
```

## 添加元素

使用`append()`，`insert()`，`extend()`函数来添加列表元素。

### `append()`

用于在列表的末尾追加新的元素，无返回值。如：

```python
list1 = ["a", "b", "c", "d", "e", "f", "g", "h"]
list1.append("g")
print(list1)
# 输出：['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'g']
```

### `insert()`

用于在列表的中间插入元素，无返回值。<br />语法格式：

```python
list.insert(index, obj)
```

其中，index是要插入元素的索引，obj是要插入的元素。如：

```python
list1 = ["a", "b", "c", "d", "e", "f", "g", "h"]
list1.insert(3, "i")
print(list1)
# 输出：['a', 'b', 'c', 'i', 'd', 'e', 'f', 'g', 'h']
```

### `extend()`

用于在列表末尾一次性追加另一个序列中的多个值（用新列表扩展原来的列表），无返回值。<br />注意，extend()
内追加的元素必须是可转换为list的类型的元素。

```python
list1 = ["a", "b", "c", "d", "e", "f", "g", "h"]
str1 = "hello"
list1.extend(str1)
print(list1)
# 输出：['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'h', 'e', 'l', 'l', 'o']
```

## 删除元素

删除列表元素有多种方法。

### `pop()`

语法格式：

```python
pop(index)
```

使用index指定索引来删除元素，若不指定索引则删除最后一个。<br />如：

```python
list1 = ["a", "b", "c", "d", "e", "f", "g", "h"]
list1.pop()
print(list1)
list1.pop(1)
print(list1)
# 输出：
# ['a', 'b', 'c', 'd', 'e', 'f', 'g']
# ['a', 'c', 'd', 'e', 'f', 'g']
```

### `remove()`

语法格式：`remove(obj)`<br />remove用于指定删除的数据，若指定的数据不存在则会报错。<br />如：

```python
list1 = ["a", "b", "c", "d", "e", "f", "g", "h"]
list1.remove("a")
print(list1)
list1.remove("hello")
# 输出：
# ['b', 'c', 'd', 'e', 'f', 'g', 'h']
# 错误
```

### `del()`

与`pop()`方法类似，del方法也是根据下标删除，但是del方法没有返回值而pop方法有<br />del方法必须指定索引。<br />语法格式：

```python
del list[index]
```

如：

```python
list1 = ["a", "b", "c", "d", "e", "f", "g", "h"]
del list1[1]
print(list1)
# 输出：['a', 'c', 'd', 'e', 'f', 'g', 'h']
```

### `clear()`

clear()会直接清空列表中的所有元素。<br />语法格式：

```python
list.clear()
```

如：

```python
list1 = ["a", "b", "c", "d", "e", "f", "g", "h"]
list1.clear()
print(list1)
# 输出： []
```

## 修改列表元素

### 通过索引

通过对列表索引的元素重新赋值来修改列表元素，即下标和切片。

```python
list1 = ["a", "b", "c", "d", "e", "f", "g", "h"]
list1[1] = "aaa"
print(list1)
list1[1:3] = ['1', '2']
print(list1)
# 输出：
# ['a', 'aaa', 'c', 'd', 'e', 'f', 'g', 'h']
# ['a', '1', '2', 'd', 'e', 'f', 'g', 'h']
```

### 反转列表

要反转列表，使用`reverse()`方法。

```python
list1 = ["a", "b", "c", "d", "e", "f", "g", "h"]
list1.reverse()
print(list1)
# 输出： ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
```

### 排序列表

对列表内的元素进行排序（排序列表的数据类型需一致）可以使用`sort()`
方法，它会修改原来的列表而不是返回一个新的排序列表；若要返回一个新列表，可以使用`sorted()`方法。<br />语法格式如下。

```python
list.sort(key=None, reverse=False)
```

其中，key和reverse都是可选参数：

- key：指定用于排序的比较函数。默认情况下，sort()方法使用自然排序（即按照数字和字母的顺序进行排序）。
- reverse：指定排序方式。默认情况下，reverse=False表示按照升序排序，reverse=True表示按照降序排序。

如：

```python
# 对列表进行升序排序
list1 = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
sorted_list = sorted(list1)
print(sorted_list)
# 输出：[1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]

# 对列表进行降序排序
list1 = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
sorted_list = sorted(list1, reverse=True)
print(sorted_list)
# 输出：[9, 6, 5, 5, 5, 4, 3, 3, 2, 1, 1]

# 对字符串列表进行排序
list1 = ["apple", "orange", "banana", "pear"]
sorted_list = sorted(list1, key=lambda x: len(x))
print(sorted_list)
# 输出：['pear', 'apple', 'orange', 'banana']
```

## 复制列表

使用`list2 = list1` 来复制列表，但是`list2` 将只是对 `list1` 的引用，对`list1`的更改也会作用与`list2`上。

```python
list1 = ["a", "b", "c"]
list2 = list1
print(id(list1))
print(id(list2))
# 输出：
# 2254690297600
# 2254690297600
```

可以看到，list1和list2的内存地址一样，表示二者是同一个对象。<br />若要复制列表内容，则可以使用`copy()`方法。

```python
list1 = ["a", "b", "c"]
list2 = list1.copy()
print(id(list1))
print(id(list2))
# 输出：
# 1953045194816
# 1953045057856
```

## 判断成员关系

当我们需要判断一个元素是否属于一个列表时，可以使用`in`和`not in`运算符。<br />需要注意的是，`in`和`not in`
运算符只能用于判断单个元素是否在列表中。如果需要判断多个元素是否在列表中，可以使用循环结构或集合（set）来实现。

- in：如果一个元素属于列表，返回True；否则返回False。
- not in：如果一个元素不属于列表，返回True；否则返回False。

```python
list1 = [1, 2, 3, 4, 5]
# 判断元素是否在列表中
print(3 in list1)    # 输出 True
print(6 in list1)    # 输出 False

# 判断元素是否不在列表中
print(3 not in list1)    # 输出 False
print(6 not in list1)    # 输出 True
```

## 统计方法

- **获取列表中元素的个数**

使用`len()`方法来获取列表中元素的个数：

```python
list1 = ["a", "b", "c", "d", "e", "f", "g", "h"]
print(len(list1))
# 输出：8
```

- **统计字符串出现的次数**

使用`count()`方法来统计字符串出现的次数：

```python
list1 = ['apple', 'banana', 'cherry', 'apple', 'banana', 'apple']
count = list1.count('apple')
print(count)
# 输出：3
```

- **统计字符串第一次出现的位置**

使用`index()`方法来统计字符串第一次出现的次数，输出结果为索引位置。

```python
list1 = ['apple', 'banana', 'cherry', 'apple', 'banana', 'apple']
print(list1.index('banana'))
# 输出：1
```
