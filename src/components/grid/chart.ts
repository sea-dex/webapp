import { Chart } from "klinecharts";

export const updateChartStyles = (chart: Chart) => {
    const styles = chart.getStyles()

    // change styles
    // styles. 111c30
    // up(green): #099882
    // down(red): #f33645
    styles.grid.vertical.color = '#1e2d39'
    styles.grid.horizontal.color = '#212530'// '#121d31'
    // #2a2e39
    styles.xAxis.axisLine.color = '#2a2e39'
    styles.yAxis.axisLine.show = false
    // styles.separator.color = '#111c30' // backgroud color to hide
    styles.xAxis.tickLine.color = '#2a2e39'
    styles.yAxis.tickLine.color = '#2a2e39'

    styles.candle.tooltip.custom = [
        { title: 'open', value: '{open}' },
        { title: 'high', value: '{high}' },
        { title: 'low', value: '{low}' },
        { title: 'close', value: '{close}' },
      ]
    chart.setStyles(styles)
}
