---
title: 字符串
date: 2024-07-28
category: python
tag:
  - python
---

## 字符串

字符串是一系列字符，比如"this is a string"，'this is a string'。

## 级联

```python
str1 = "abc" "def"
str2 = "abc" + "def"
print(str1)
print(str2)
# 输出结果：abcdef
```

两个输出的结果相同 ，这也是python拼接字符串的两种方法<br />还可以使用 * 来重复字符串，如：

```python
str3 = "abc" * 3  # 整个字符串重复三次
print(str3)
# 输出结果是：abcabcabd
```

## 格式化

格式化是指将变量的值填充到字符串中，并对字符串进行格式化显示

1. % 字符串格式化

如：

```python
name = input("input your name:")
school = input("input your school:")
sch_info = "my name is %s,my school is %s" % (name, school)
print(sch_info)
```

字符串会以%控制的形式来输出。下面是一些常见的占位符

| 占位符  | 标志位控制输出格式  |
|------|------------|
| %s   | 字符串型       |
| %d   | 十进制整型      |
| %b   | 二进制整型      |
| %0   | 八进制整型      |
| %X   | 十六进整型      |
| %f   | 浮点型        |
| %.2f | 保留2位小数的浮点型 |
| %%   | %本身        |

2. format属性格式化

这个方法是一个非常实用且强大的方法，可以实现很多复杂的对齐要求。

```python
format_str1 = "my name is {},my school is {}".format(name, school)
print(format_str1) # 先输出name，再输出school
format_str2 = "my name is {1},my school is {0}".format(name, school)
print(format_str2)  # 先输出school，再输出name
format_str3 = "my name is {nam},my school is {sch}".format(nam=name, sch=school)
print(format_str2)  # 先输出school，再输出name
```

3. F标志位格式化

从python3.6支持的功能<br />在字符串引号前，加上"f"或者"F"；在字符串中，使用大括号**{ }**包裹要替换字段的字符串文字<br />如：

```python
name = "root"
age = 18
str1 = f"my name is {name}, my age is {age}"
print(str1)
```

#### 转义字符

在python中也有转义字符，常配合格式控制符一起使用。下面是一些常见的转义字符：

| 转义字符   | 说明                        |
|--------|---------------------------|
| \\n    | 换行符                       |
| \\r    | 回车符                       |
| \\t    | 水平制表符Tab                  |
| \\a    | 响铃                        |
| \\b    | 退格符Backspace              |
| \\\\\\ | 反斜线本身                     |
| \\\\'  | 单引号                       |
| \\\\"  | 双引号                       |
| \\     | 在字符串行尾的续行符，即一行未完，转到下一行继续写 |

如果不想让转义符生效，可以在引号前加上"r"，即原样输出 。如：

```python
print(r"a\tb")
#输出结果：a\tb
```

## 切片

### 下标取值

将字符串看作一个列表，第一个字符下标为0，第二个字符下标为1，以此类推可以标记出字符串中每一个字符；同理，可以从-1开始由后往前标记每一个字符。如：

| 字符   | a  | b  | c  | d  | e  |
|------|----|----|----|----|----|
| 正向下标 | 0  | 1  | 2  | 3  | 4  |
| 反向下标 | -5 | -4 | -3 | -2 | -1 |

```python
str = 'abcde'
str[1] = 'b'
str[-3] = 'c'
```

### 切片取值

`str [start : end : step]`

- [:] 提取从开头（默认位置0）到结尾（默认位置-1）的整个字符串
- [start:] 从start 提取到结尾
- [ :end ] 从开头提取到end - 1
- [start : end] 从start 提取到end - 1
- [start : end : step] 从start 提取到end - 1，每step 个字符提取一个

此外， step默认=1，表示正向索引。<br />若step为其他正整数，则间隔取字；如step=2时，每2个字符取1个字符。<br />
若step为负数，则表示负向索引。<br />如：

```python
str1 = "abc123456"
print(str1[:4])  # 取[4]之前，不包括[4]
print(str1[3:7])  # 取[3]至[7]之间
print(str1[6::-1])  # 从[6]到[0]
print(str1[-2:2:-2])  # 从[-2]到[2]每2取1
print(str1[2:-2:-2])  # start<end NULL
# 输出结果：
# abc1
# 1234
# 4321cba
# 531
# 第五个没有输出，因为它沿负向无法从start到end
```

## 属性方法

对于一个字符串，可以使用 **dir** 方法来查看它的全部属性方法。如：

```python
print( dir("xxx123") )
# 输出结果：['__add__', '__class__', '__contains__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__getnewargs__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__iter__', '__le__', '__len__', '__lt__', '__mod__', '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__rmod__', '__rmul__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'capitalize', 'casefold', 'center', 'count', 'encode', 'endswith', 'expandtabs', 'find', 'format', 'format_map', 'index', 'isalnum', 'isalpha', 'isascii', 'isdecimal', 'isdigit', 'isidentifier', 'islower', 'isnumeric', 'isprintable', 'isspace', 'istitle', 'isupper', 'join', 'ljust', 'lower', 'lstrip', 'maketrans', 'partition', 'removeprefix', 'removesuffix', 'replace', 'rfind', 'rindex', 'rjust', 'rpartition', 'rsplit', 'rstrip', 'split', 'splitlines', 'startswith', 'strip', 'swapcase', 'title', 'translate', 'upper', 'zfill']
```

使用 “变量名.方法名()” 的方式访问对象一系列属性方法。如：

## 简单判断

```python
print( f"是否全为大写:{ 'xxABC'.isupper() }")
# 输出结果：是否全为大写:False
print( f"是否全为数字: { '123'.isdigit() }")
# 输出结果：是否全为数字: True
print( f"是否为标题字符:{ 'A Beautiful girl'.istitle() }")
# 输出结果：是否为标题字符:False
print( f"判断开始字符: { 'abc123'.startswith('abc') }")
# 输出结果：判断开始字符: True

# 判断某一段范围内是不是以abc开始
print( f"判断开始字符: { 'abc123'.startswith('abc',3) }")
# 输出结果：判断开始字符: False
# 判断某一段范围内是不是以123结束
print( f"判断结束字符: { 'abc123'.endswith('123')}")
# 输出结果：判断结束字符: True
```

## 判断成员关系

有 **in** 方法和 not in 方法；输出结果为True或Flase

```python
print("a" in "abc")
print("abd" not in "abc")
```

## 遍历

使用for循环依次读取字符串的内容，再进行操作。如打印字符串中的每一个字符：

```python
for i in "abc":
    print(i)
```

## 查找统计类

- 获取字符串长度

```python
print( len("abcdefg") )
# 输出结果：7
```

- 统计子字符串在父字符串中出现的次数

```python
print( "abbbsedrwfasdvbab".count("ab") )
# 输出结果：2
```

- 查看字符第一次出现的下标位置

```python
print( "abbcd".index("b") )
# 输出结果：1
# 类似于字符串的下标取值，这里的结果也是指字符串的下标1，而非常识中的第2个
print( "abbcd".index("x") )  
#如果没有这个子字符串，python控制台就会报错
```

- 查看子字符串第一次出现的下标位置

```python
print("abbcd".find("b"))
# 输出结果：1
print("abbcd".find("x"))
# 输出结果：-1
# 如果没有这个子字符串，python控制台输出-1
```

## 转换类

```python
print(f"将字符串转化为大写：{ 'baLWEOSLD23443'.upper()  }")
# 输出结果：将字符串转化为大写：BALWEOSLD23443
print(f"将字符串转化为小写：{ 'baLWEOSLD23443'.lower()  }")
# 输出结果：#将字符串转化为小写：balweosld23443
print(f"转化为标题格式：{ 'the world'.title() }")
# 输出结果：转化为标题格式：The World
```

## 切割

```python
str1 = "a34lg5$4r:*sdefrwe#234%#"
print(f" 字符串的切割: { str1.split('#') }")
# 以#为标志切割字符串
# 输出结果：字符串的切割: ['a34lg5$4r:*sdefrwe', '234%', '']
```

## 去除首尾特定字符

移除字符串首尾指定的字符（默认为空格或换行符）<br />该方法只能删除开头或是结尾的字符，不能删除中间部分的字符。

```python
str1 = "   string    ";   # 去除首尾空格
print str1.strip();
# 输出结果：string
str2 = "001234500000"; 
print str2.strip( '0' );  # 去除首尾字符的0
# 输出结果：12345
```

## 替换

使用 replace 方法来替换，语法格式为`str.replace(old, new[, max])` 。<br />
将old字符替换为new字符，并且替换次数不超过max次；如不指定max，则全部替换。<br />如：

```python
str1 = "aaabbb".replace("a", "c",2)
print(str1)
# 输出结果：ccabbb
```

## 填充

使用 **center** 、**ljust** 和 **rjust** 方法，语法格式为`str.center(width[, fillchar])`。<br />
返回一个原字符串居中/左对齐/右对齐,并使用空格填充至长度 width
的新字符串。如果指定的长度小于字符串的长度则返回原字符串。<br />如：

```python
print("hello world".center(20, "*"))
print("hello world".ljust(30, "*"))
print("hello world".rjust(40, "*"))
# 输出结果:
# ****hello world*****
# hello world*******************
# *****************************hello world
```
