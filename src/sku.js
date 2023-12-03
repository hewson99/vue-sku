const prodColumns = {
    pic: {
      label: 'price',
      width: '100px',
      meta: {
        component: 'skuImage',
        required: true,
        index: 'pic'
      },
    },
  }
  
  
  
  class Node {
      constructor(parent, el) {
          this.parent = parent
          this.elem = el != null ? el : null
          this.children = []
          this.root = false
          // only leaf node
          // this.data = {}
          if (parent) {
              parent.children.push(this)
          }
      }
      isEmpty() {
          return this.elem == null
      }
  }
  
  class SkuManager {
      constructor(columns) {
          this.reset(columns)
      }
      reset(columns = {}) {
          this.root = new Node()
          this.root.root = true
          this.data = []
          this.pathData = []
          this._tableColumns = columns
      }
      getTableColumns() {
          return this._tableColumns
      }
      updateTableColumns(newTableColumns) {
          this._tableColumns = newTableColumns
      }
      /**
       *
       * @param {{value: string, detail: string[]}[]} refs
       * @returns
       */
      init(refs) {
        refs.forEach((it, idx) => {
            it.detail.forEach(de => {
                this.add(idx, de)
            })
        })
        return this.genData(refs)
      }
      /**
       * 
       * @param {number} idx column index 
       * @param {*} elem column value
       */
      add(idx, elem) {
          this._add(-1, this.root, idx, elem)
      }
      _add(level, node, idx, elem) {
          if (level + 1 === idx) {
              // node is parent
              if (!node.children.length) {
                  const newNode = new Node(node, elem)
                  // passes data to leafNode child
                  newNode.data = node.data
                  node.data = null
              } else {
                  const sample = node.children[0]
                  if (sample.isEmpty()) {
                      // reuse empty node
                      sample.elem = elem
                      return
                  }
                  const newChild = this.cloneNode(node, sample)
                  newChild.elem = elem
              }
          } else {
              if (!node.children.length) {
                  // add empty placeholder
                  new Node(node)
              }
              node.children.forEach(child => {
                  this._add(level + 1, child, idx, elem)
              })
          }
      }
      deleteNode(idx, elems) {
        elems.forEach(elem => {
            this.delete(idx, elem)
        })
        this.delete(idx, null, false)
      }
      /**
       * 
       * @param {number} idx column index 
       * @param {*} elem column value
       * @param {boolean} toEmpty whether the node was retained
       * @returns 
       */
      delete(idx, elem, toEmpty = true) {
          this._delete(-1, this.root, idx, elem, toEmpty)
          let node = this.root
          while (node.children && node.children.length) {
              node = node.children[0]
              if (!node.isEmpty()) {
                  return
              }
          }
          node.data = null
          console.log('should empty', this.root)
      }
      _delete(level, node, idx, elem, toEmpty) {
          if (level + 1 === idx) {
              // node is parent
              if (!node.children.length) {
                  return
              }
              const sample = node.children[0]
              const filtered = node.children.filter(child => child.elem !== elem)
  
              node.children = filtered
              if (filtered.length) {
                  return
              }
  
              let ancestor = node
              if (toEmpty) {
                  ancestor = new Node(node)
              }
              if (sample.children.length) {
                  sample.children.forEach(child => {
                      child.parent = ancestor
                      ancestor.children.push(child)
                  })
              } else {
                  if (ancestor.parent) {
                      // extends leaf node data
                      ancestor.data = sample.data
                  }
              }
  
          } else {
              node.children.forEach(child => {
                  this._delete(level + 1, child, idx, elem, toEmpty)
              })
          }
      }
      cloneNode(parent, node) {
          const newNode = new Node(parent, node.elem)
          node.children.forEach(child => {
              this.cloneNode(newNode, child)
          })
          return newNode
      }
      /**
       *
       * @param {{value: string, detail: string[]}[]} refs
       * @returns
       */
      genData(refs, showEmpty) {
          this.data = []
          this.pathData = []
          this._genData(this.root, [], showEmpty)
          if (this.data.length) {
              return {
                  data: this.data,
                  ...this.genHeader(refs)
              }
          } else {
              return {
                  data: [],
                  slots: [],
                  header: []
              }
          }
      }
      _genData(node, path, showEmpty) {
          if (!node.children.length) {
              if (!path.length) {
                  return
              }
              node.data = node.data || {}
              const newData = {}
              path.forEach((elem, idx) => {
                  newData['value' + (idx + 1)] = elem
              })
              Object.keys(this._tableColumns).forEach(k => {
                  newData[k] = (node.data && node.data[k] != null) ? node.data[k] : ''
              })
              node.data = newData
              this.data.push(newData)
              this.pathData.push(path.join('->'))
              return
          }
          node.children.forEach(child => {
              this._genData(child, showEmpty || !child.isEmpty() ? path.concat(child.elem) : path, showEmpty)
          })
      }
  
      /**
       *
       * @param {{value: string, detail: string[]}[]} refs
       * @returns
       */
      genHeader(refs) {
          if (!this.data.length) {
              return
          }
  
          let p = this.root.children[0]
          let j = 0
          let k = 0
          const header = []
          const slots = []
          const items = []
  
          while (p) {
              if (!p.isEmpty()) {
                  items.push({
                      value: refs[j].value,
                      detail: refs[j].detail
                  })
                  header.push({
                      label: refs[j].value,
                      prop: 'value' + (k + 1)
                  })
                  k++
              }
              j++
              p = p.children[0]
          }
  
          this.data.forEach((row) => {
              const detail = row.detail = {}
              header.forEach((col) => {
                  detail[col.label] = row[col.prop]
              })
          })
  
          Object.keys(this._tableColumns).forEach(i => {
              slots.push(Object.assign({}, this._tableColumns[i].meta))
              header.push({
                  label: this._tableColumns[i].label,
                  prop: i,
                  slot: true,
                  width: this._tableColumns[i].width
              })
          })
  
          this.items = items
          return {
              header,
              slots
          }
      }
  }
  
  export {
      SkuManager, 
      prodColumns,
  }