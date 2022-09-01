<!--角色名模糊下拉分页-->
<template>
  <div class="role-select-container">
    <el-select
      v-model="roleIds"
      :loading="loading"
      clearable
      filterable
      v-bind:multiple="roleMultiple === true"
      placeholder="请输入角色名称"
      @change="change"
      style="width: 200px;"
      v-load-more="loadMore"
    >
      <el-option
        v-for="item in roles"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>

import {pageRole} from "@/api/role";

export default {
  name: 'RoleSelect',
  props: {
    // 角色是否是多选
    roleMultiple: { type: Boolean, required: false },
    // 默认选中
    defaultRoles: { type: Array, required: false },
  },
  mounted() {
    this.loadRole()
  },
  data() {
    return {
      roleIds: [], // 选中的角色id集合
      // roleNameCn: undefined,
      loading: false,
      roles: [],
      page: 1,
      size: 10,
      totalPage: undefined, // 下拉总页码
    }
  },
  watch: {
    // 监听
    defaultRoles() {
      this.roleIds = this.defaultRoles
    },
  },
  methods: {
    loadRole() {
      this.loading = true
      const page = {page: this.page, size: this.size, roleNameCn: this.roleNameCn}
      pageRole(page).then(response => {
        this.totalPage = Number(response.data.data.totalPage)
        const content = response.data.data.content
        if (content && content.length > 0) {
          content.forEach((role, index, arr) => {
            this.roles.push({value: role.id, label: role.roleNameCn})
          })
        }
        // 第一次时请求接口数据还未过来，默认值设置不生效，所以这里再次设置下。
        this.roleIds = this.defaultRoles

      }).catch(err => {
        console.warn('err', err)
      }).finally(() => {
        this.loading = false
      })
    },
    change(roleId) {
      // 给父组件传递值
      this.$emit('getSelectRoleIds', roleId)
    },
    loadMore: function() {
      // 总页数大于当前页，请求下一页数据
      if (this.totalPage > this.page) {
        this.page += 1;
        this.loadRole();
      }
    }
  }
}
</script>

<style scoped>
  .role-select-container{
    display: inline-block;
  }
</style>
