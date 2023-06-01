<!--角色名称模糊下拉分页, 搜索结果不存在时，可以创建元素-->
<template>
  <div class="roleName-select-container">
    <el-select
      v-model="roleName"
      v-load-more="loadMore"
      style="width: 200px;"
      :loading="loading"
      allow-create
      clearable
      filterable
      placeholder="请输入角色名"
      @change="change"
      @clear="clear"
    >
      <el-option
        v-for="item in roleNames"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>

import { pageRoleByField } from "@/api/role";

export default {
  data() {
    return {
      roleName: undefined,
      loading: false,
      roleNames: [],
      page: 1,
      size: 10,
      totalPage: undefined, // 下拉总页码
    }
  },
  mounted() {
    // 优先加载下拉框数据
    this.loadRoleName(this.username)
  },
  methods: {
    loadRoleName() {
      this.loading = true
      const page = { page: this.page, size: this.size, roleNameCn: this.roleName }
      pageRoleByField(page).then(data => {
        this.totalPage = Number(data.totalPage)
        const content = data.content
        if (content && content.length > 0) {
          // 将value使用逗号拼接起来，用于去重。
          const existsRoleNames = this.roleNames.map((item) => {
            return item.value
          }).join()
          content.forEach((role, index, arr) => {
            if (existsRoleNames.indexOf(role.roleNameCn) === -1) {
              this.roleNames.push({ value: role.roleNameCn, label: role.roleNameCn })
            }
          })
        }
      }).catch(err => {
        console.warn('err', err)
      }).finally(() => {
        this.loading = false
      })
    },
    change(roleName) {
      // 给父组件传递值
      this.$emit('getRoleName', roleName)
    },
    clear() {
      // 去掉框中的值
      this.roleName = undefined;
      // 给父组件传递值
      this.$emit('getRoleName', undefined)
    },
    loadMore: function() {
      // 总页数大于当前页，请求下一页数据
      if (this.totalPage > this.page) {
        this.page += 1;
        this.loadRoleName();
      }
    }
  }
}
</script>

<style scoped>
  .roleName-select-container{
    display: inline-block;
  }
</style>
