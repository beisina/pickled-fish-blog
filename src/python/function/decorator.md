---
title: 装饰器
date: 2024-07-30
category: python
tag:
  - python
---

## 闭包

要了解装饰器，首先要了解闭包。闭包就是在函数中再嵌套一个函数，并且引用外部函数的变量，这就是一个闭包了。<br />闭包的三个必要条件：

- 在一个外函数中定义了一个内函数
- 内函数引用了外函数的临时变量
- 外函数的返回值是内函数的引用

例如：

```python
def outer(x):
    def inner(y):
        return x + y
    return inner

print(outer(1)(2))
```

在outer函数内，定义了一个inner函数，并且inner函数又引用了外部函数outer的变量x，这就是一个闭包。在输出时，outer(1)(2)
,第一个括号传进去的值返回inner函数，其实就是返回 1 + y，所以再传第二个参数进去，就可以得到返回值。

> 闭包使得函数内局部变量的值始终保持在内存中，不会在外层函数调用后被自动清除

## 装饰器

装饰器是一种程序设计模式，用于在不改变原函数的情况下，为函数添加新的功能。<br />装饰器其实就是一个闭包。<br />例如：

```python
def hello(func):
    def inner():
        print('hello')
        func()
    return inner()

@hello
def helloworld():
    print('hello world')
# 输出：
# hello
# hello world
```

在上述代码中，定义了一个装饰器`hello`，可以看到，hello函数接收一个函数func，在inner函数内部先执行`print`再执行`func()`
，最后返回自身。在`helloworld()`函数前使用`@`来为函数使用装饰器，这是python的一个语法糖，实际上与`hello(helloworld)`
等效。<br />函数允许多个装饰器，将从下到上依次执行。如：

```python
@a
@b
def c():
    pass
```

这个函数等于`a(b(c))`，即先执行`b(c)`，得到的结果再被装饰器a装饰。

### 统计函数运行时间

```python
import time

def cost_time(func):
    def fun(*args, **kwargs):
        t = time.perf_counter()
        result = func(*args, **kwargs)
        print(f'func {func.__name__} cost time:{time.perf_counter() - t:.8f} s')
        return result

    return fun

@cost_time
def test():
    print('func start')
    time.sleep(1)
    print('func end')

if __name__ == '__main__':
    test()
```

## 带参数的装饰器

