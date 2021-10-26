import { defineComponent, ref } from 'vue';


const InputMe = defineComponent({
  setup() {
    let content = ref('sad')
    let handleChange = (el) => {
      console.log(el.target.value)
      content.value=el.target.value
    }
    console.log(1)
    return () => (
      <>
      <div>{content.value}</div>
      <input value={content.value} onInput={handleChange}/>
      </>
    )
  }
  // render() {
  //   return <div>hello, this is jsx featrues support!</div>
  // }
})

export default InputMe