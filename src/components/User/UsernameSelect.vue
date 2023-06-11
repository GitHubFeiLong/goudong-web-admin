<!--用户名模糊下拉分页, 搜索结果不存在时，可以创建元素-->
<template>
  <div class="username-select-container">
    <el-select
      v-model="username"
      v-load-more="loadMore"
      style="width: 230px;"
      :loading="loading"
      allow-create
      clearable
      filterable
      placeholder="请输入用户名"
      @change="change"
      @clear="clear"
    >
      <el-option
        v-for="item in usernames"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>

import { pageUserByField } from "@/api/user";

export default {
  data() {
    return {
      username: undefined,
      loading: false,
      usernames: [],
      page: 1,
      size: 10,
      totalPage: undefined, // 下拉总页码
    }
  },
  mounted() {
    // 优先加载表格数据
    this.loadUsername(this.username)
  },
  methods: {
    loadUsername() {
      this.loading = true
      const page = { page: this.page, size: this.size, username: this.username }
      pageUserByField(page).then(data => {
        this.totalPage = Number(data.totalPage)
        const content = data.content
        if (content && content.length > 0) {
          // 将value使用逗号拼接起来，用于去重。
          const existsUsernames = this.usernames.map((item) => {
            return item.value
          }).join()
          content.forEach((user, index, arr) => {
            if (existsUsernames.indexOf(user.username) === -1) {
              this.usernames.push({ value: user.username, label: user.username })
            }
          })
        }
      }).catch(err => {
        console.warn('err', err)
      }).finally(() => {
        this.loading = false
      })
    },
    change(username) {
      // 给父组件传递值
      this.$emit('getUsername', username)
    },
    clear() {
      // 去掉框中的值
      this.username = undefined;
      // 给父组件传递值
      this.$emit('getUsername', undefined)
    },
    loadMore: function() {
      // 总页数大于当前页，请求下一页数据
      if (this.totalPage > this.page) {
        this.page += 1;
        this.loadUsername();
      }
    }
  }
}
</script>

<style scoped>
  .username-select-container{
    display: inline-block;
  }
</style>
