# 代码说明

这份代码包含了一个名为SkuManager的类，以及一些辅助的Node类。SkuManager类用于管理SKU（库存量单位）相关的数据，包括初始化、添加、删除和生成数据等功能。

## [在线 DEMO](https://weipo3.github.io/vue-sku/)

## 使用方法

### 初始化

```javascript
const skuManager = new SkuManager(prodColumns);
```

### 添加数据

```javascript
skuManager.add(0, 'value1');
skuManager.add(1, 'value2');
```

### 删除数据

```javascript
skuManager.delete(0, 'value1');
```

### 生成数据

```javascript
const data = skuManager.init([{ value: 'value1', detail: ['detail1', 'detail2'] }]);
```

## 类和方法说明

### Node类

- `constructor(parent, el)`: Node类的构造函数，用于创建节点。
- `isEmpty()`: 判断节点是否为空。

### SkuManager类

- `constructor(columns)`: SkuManager类的构造函数，接受一个columns参数。
- `reset(columns)`: 重置SkuManager实例。
- `getTableColumns()`: 获取表格列信息。
- `updateTableColumns(newTableColumns)`: 更新表格列信息。
- `init(refs)`: 初始化SKU数据。
- `add(idx, elem)`: 添加SKU数据。
- `deleteNode(idx, elems)`: 删除SKU数据。
- `genData(refs, showEmpty)`: 生成SKU数据。
- `genHeader(refs)`: 生成表头信息。
