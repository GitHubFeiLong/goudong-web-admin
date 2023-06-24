<script>
export default {
  name: 'Item',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    console.log(h)
    console.log(context.props)
    const vnodes = []
    // if (true) {
    //   vnodes.push(<span>
    //     <i class={[icon, 'iconfont', 'sub-el-icon']}/>
    //     <span style='margin-left:10px' class='el-tree-node-span'>{(title)}</span>
    //   </span>)
    //   return vnodes
    // }
    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else if (icon.includes('iconfont-')) {
        vnodes.push(<i class={[icon, 'iconfont']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      vnodes.push(<span className='el-tree-node-span'>{{ title }}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
