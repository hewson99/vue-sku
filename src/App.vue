<script setup>
import { SkuManager, prodColumns } from './sku';
import { reactive  } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
const contentRefs = reactive({})
const rules = reactive([
  { value: 'chip', detail: ['i5', 'i7']},
  { value: 'memory', detail: ['8GB']},
  { value: 'storage', detail: ['512GB']},
])
const tableConfig = reactive({
  data: [],
  columns: []
})
const sku = new SkuManager(prodColumns)

const tableData = sku.init(rules)

const removeSkuAttr = (ruleIdx, skuAttrName) => {
  console.log('removeSkuAttr:', ruleIdx, skuAttrName)

  rules[ruleIdx].detail = rules[ruleIdx].detail.filter(it => it !== skuAttrName)
  console.log('rules=', rules)
  sku.delete(ruleIdx, skuAttrName)
  const newTableData = sku.genData(rules)
  setState(newTableData)
}

const removeSkuRow = (ruleIdx, skus) => {
  console.log('removeSkuRow:', ruleIdx, skus)

  contentRefs[ruleIdx] = ''

  rules.splice(ruleIdx, 1)

  sku.deleteNode(ruleIdx, skus)
  const newTableData = sku.genData(rules)
  setState(newTableData)
}

const addSkuAttr = (ruleIdx) => {
  let name = contentRefs[ruleIdx]
  if (name) {
    name = name.trim()
    if (rules[ruleIdx].detail.includes(name)) {
      return
    }

    contentRefs[ruleIdx] = ''

    rules[ruleIdx].detail.push(name)

    sku.add(ruleIdx, name)
    const newTableData = sku.genData(rules)
    setState(newTableData)
  }
}

const addSkuRow = () => {
  const ruleIdx = rules.length
  rules[ruleIdx] = { value: contentRefs.skuName, detail: [] }

  contentRefs.skuName = ''
  
  sku.add(ruleIdx, null)
  const newTableData = sku.genData(rules)
  setState(newTableData)
}

const setState = (tableData) => {
  console.log('tableData=', tableData)
  tableConfig.data = tableData.data
  tableConfig.columns = tableData.header
}


setState(tableData)

console.log(tableData, sku)
</script>

<template>
  <div class="sku-wrap">
    <div class="sku-item" v-for="(rule,ruleIdx) in rules" :key="rule.value">
      <el-row  class="sku-name-row sku-row">
        <el-col :span="2">
          <span>sku name:</span>
        </el-col>
        <el-col :span="4">
          <el-input  readonly v-model="rule.value"></el-input>
        </el-col>
        <el-col class="sku-delete" :span="4" style="margin-left: 20px; display: none;">
          <el-button @click="removeSkuRow(ruleIdx, rule.detail)" type="danger" :icon="Delete" circle />
        </el-col>
      </el-row>
      <el-row  class="sku-attr-row sku-row">
        <el-col :span="2">
          <span>sku value:</span>
        </el-col>
        <el-col  :span="20">
          <el-tag closable  @close="removeSkuAttr(ruleIdx, sku)"
          style="margin-left: .5rem" v-for="sku in rule.detail" :key="sku">{{ sku }}</el-tag>
          <el-input
            style="width:150px; margin-left: 20px;"
            v-model="contentRefs[ruleIdx]"
            class="w-50 m-2"
            size="small"
            placeholder="Please Input"
          > 
            <template #suffix>
              <el-button @click="addSkuAttr(ruleIdx)" type="text" :icon="Plus"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
    </div>
      <el-input
        style="width:200px"
        v-model="contentRefs.skuName"
        class="w-50 m-2"
        size="small"
        placeholder="Please Input new sku"
      > 
        <template #suffix>
          <el-button @click="addSkuRow" type="text" :icon="Plus"></el-button>
        </template>
      </el-input>
  </div>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-table :data="tableConfig.data" style="width: 100%">
        <el-table-column v-for="col in tableConfig.columns" :prop="col.prop" :label="col.label" width="180">
          <template #default="scope" v-if="col.slot">
            <el-input v-model="scope.row[col.prop]"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="12">
      <pre>
        <code>
          {{ tableConfig.data }}
        </code>
      </pre>
    </el-col>
  </el-row>
  
</template>

<style scoped>

.sku-wrap {
  padding: 1.5rem;
}

.sku-item {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 30px;
}

.sku-name-row {
  padding: 10px;
  background: #e5e9f2;
  border-radius: 4px;
}
.sku-name-row:hover .sku-delete {
  display: block!important;;
}

.sku-attr-row {
  padding: 10px;
  background: #f8f8f8;
  border-radius: 4px;
}

.sku-row + .sku-row {
  margin-top:20px;
}
</style>
