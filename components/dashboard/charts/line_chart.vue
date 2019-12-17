<script>
import { Line, mixins } from 'vue-chartjs'
export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ['chartData', 'options', 'width', 'height'],
  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style lang="scss" scoped></style>
