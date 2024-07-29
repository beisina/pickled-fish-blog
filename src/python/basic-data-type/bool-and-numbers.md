---
title: 布尔值和数字
date: 2024-07-28
category: python
tag:
  - python
---

## 布尔类型

Python中的布尔类型只有两种值：`True`和`False`。
其中，True = 1，表示真；False = 0，表示假
常见的为假的元素：`''，0，0.0，0)，[]，{}，None，False`
布尔类型可以参与计算，如：

```python
num1 = True  + True
print(num1)
# 输出结果：2
num2 = (1 == 2) + (2 == 2)
print(num2)
# 输出结果：1
```

## 整数

在C语言中，整数分short、int、long、long long类，而Python 的整数不分类型，Python 整数的取值范围是无限的，Python 都能轻松处理。

### 进制和进制转换

| 进制   | 表示方法                | 示例   |
|------|---------------------|------|
| 二进制  | 以0b开头，只能包含0、1，逢2进1  | 0b11 |
| 八进制  | 以0o开头，只能包含0、7，逢8进1  | 0o11 |
| 十进制  | 直接由0~9组成，逢10进1      | 11   |
| 十六进制 | 以0x开头，只能包含0~F，逢16进1 | 0x11 |

```python
# 进制转换-bin：任意进制转2进制，接收一个int，返回一个str
bin(10)='0b1010'
bin(0b11111)='0b11111'
# 进制转换-otc：任意进制转8进制，接收一个int，返回一个str
otc(0b11111)='0o37'
otc(12)='0o14'
# 进制转换-hex：任意进制转16进制，接收一个int，返回一个str
hex(111)='0x6f'
```

### 浮点数

浮点数即带有小数点的数字。 浮点数由整数位，小数点，小数位组成，也可以用科学计数法表示，如3.14，6.23e33。float是不精确的。
用一个例子来说明：

```python
>>> i = 1.0
>>> i = i -0.1
>>> i
0.9
>>> i = i -0.1
>>> i
0.8
>>> i = i - 0.1
>>> i
0.7000000000000001
```

可以通过`decimal`模块来实现精确小数。 Decimal类型数据是精确的小数，可以传递给Decimal整型或者字符串参数。

```python
from decimal import getcontext，Decimal，context
mydec = Decimal.from_float(12.222)
print(mydec)
mydec =Decima1(12.222)
print(mydec)
# 结果为Decimal( '12.2219999999999995310417943983338773250579833984375')

# 从字符串转为decimal类型
mydec = Decima1('3.14')print(mydec)
# Decimal('3.14')
```

### 复数

复数就是实数和虚数的统称。
在数学中的，复数的基本形式是a+bi,其中a,b是实数,a称为实部,bi称为虚部,i是虚数单位。
在python中使用complex来表示复数，complex的由实数部分和虚数部分组成，一般形式为x＋yj，其中的x是复数的实数部分，y是复数的虚数
部分，这里的x和y都是实数。 如：`6.23+1.5j`，`-1.32-854j`，`0+1j`

