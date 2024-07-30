---
title: 字典
date: 2024-07-28
category: python
tag:
  - python
next: /python/function/function-and-variable-transfer
---

## 概念

字典（dictionary）是一种无序、可变、可迭代的键值映射的数据结构。

字典的每个键值对用冒号 `:` 分割，每个键值对之间用逗号 `,` 分割，整个字典包括在花括号 `{ }`中。

字典的键必须唯一、不可重复，必须为不可变数据类型。

语法格式如下：

```python
my_dict = {'key1': 'value1', 'key2': 'value2'} # 大部分习惯使用
my_dict = dict(key1='value1', key2='value2')
```

## 访问字典元素

- **通过键来访问字典元素**

与列表和元组不同，要访问字典元素，需要通过键。使用key()函数来获得字典的所有键。

如：

```python
my_dict = {"name": "abc", "age": 18, "class": "1"}
print(my_dict.keys())
print(my_dict["name"])
print(my_dict["xxx"])  # 不存在键会报错
# 输出：
# dict_keys(['name', 'age', 'class'])
# abc
# 错误
```

- **通过**`get()`**方法来访问字典元素**

语法格式如下：

```python
dict.get(key, none)
```

当`get()`方法没有取到键的值时，会返回默认值None，也可以自行指定其他值。

```python
my_dict = {"name": "abc", "age": 18, "class": "1"}
print(my_dict.get("name"))
print(my_dict.get("xxx"))  # 不存在会输出None
print(my_dict.get("name", "aaa"))  # 取到了name的值则返回name，没有取到则返回aaa
print(my_dict.get("xxx", "null"))  # 没有取到值返回null
# 输出：abc None abc  null
```

- **遍历字典**

在使用for循环遍历字典时，默认遍历的是字典的key；若需同时访问字典的key和value，需要使用两个遍历来接收。

```python
my_dict = {"name": "abc", "age": 18, "class": "1"}
for i in my_dict:
    print(i)  # 输出key
for i in my_dict.values():
    print(i)  # 输出value
for i in my_dict.items():
    print(i)  # 输出key和value的元组
for k, v in my_dict.items():  # 使用两个变量分别接收key和value
    print(f"{k}-->{v}")
# 输出：
# name age class
# abc 18 1
# ('name', 'abc') ('age', 18) ('class', '1')
#name-->abc age-->18 class-->1
```

## 添加和修改字典元素

通过访问修改字典的键值来修改元素，若元素不存在则新建，存在则修改。

```python
my_dict = {"name": "abc", "age": 18, "class": "1"}
my_dict["name"] = "aaa" # 存在name键，修改值
my_dict["score"] = 80 # 不存在score键，新建键值对
print(my_dict)
# 输出：{'name': 'aaa', 'age': 18, 'class': '1', 'score': 80}
```

## 删除字典元素

使用del关键字来删除字典的键值对。

```python
del my_dict["name"]
```

使用`clear()`方法来清空字典。

```python
my_dict.clear()
```

## 判断成员关系

使用`in`和`not in`来判断元素是否在字典中。默认情况下，判断的是元素是否在字典的key中；使用`values()`来判断元素是否在字典的value中。

```python
my_dict = {"name": "abc", "age": 18, "class": "1"}
print("name" in my_dict)
print("xxx" in my_dict)
print(18 in my_dict.values())
# 输出：True False True
```
