const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div')

  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.classList.add('tooltip-chart')
    tooltipEl.style.opacity = 1
    tooltipEl.style.pointerEvents = 'none'
    tooltipEl.style.transition = 'all .1s ease'

    const table = document.createElement('div')
    table.classList.add('tooltip-chart-table')

    tooltipEl.appendChild(table)
    chart.canvas.parentNode.appendChild(tooltipEl)
  }

  return tooltipEl
}

export const externalTooltipHandler = (context) => {
  // Tooltip Element
  const { chart, tooltip } = context
  const tooltipEl = getOrCreateTooltip(chart)

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0
    return
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || []
    const bodyLines = tooltip.body.map(b => b.lines)

    const tableHead = document.createElement('thead')

    titleLines.forEach(title => {
      const th = document.createElement('p')
      th.classList.add('tooltip__title')
      const text = document.createTextNode(title)

      th.appendChild(text)
      tableHead.appendChild(th)
    })

    const tableBody = document.createElement('div')
    bodyLines.forEach((body, i) => {
      const colors = tooltip.labelColors[i]

      const circle = document.createElement('span')
      circle.classList.add('tooltip__circle')
      circle.style.background = colors.backgroundColor
      circle.style.borderColor = colors.borderColor
      const td = document.createElement('p')
      const spanLabel = document.createElement('span')
      const spanValue = document.createElement('span')
      spanLabel.classList.add('tooltip__label')
      spanValue.classList.add('tooltip__value')
      td.classList.add('tooltip__value-wrapper')
      td.appendChild(circle)

      if (Array.isArray(body)) {
        body.forEach((item, index) => {
          if (index === 0) {
            spanLabel.innerHTML = item
          }

          if (index === 1) {
            spanValue.innerHTML = item
          }
        })

        td.appendChild(spanLabel)
        td.appendChild(spanValue)
      }
      else {
        const text = document.createTextNode(body)
        td.appendChild(text)
      }

      tableBody.appendChild(td)
    })

    const tableRoot = tooltipEl.querySelector('.tooltip-chart-table')

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove()
    }

    // Add new children
    tableRoot.appendChild(tableHead)
    tableRoot.appendChild(tableBody)
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1
  tooltipEl.style.left = positionX + tooltip.caretX + 'px'
  tooltipEl.style.top = positionY + tooltip.caretY + 'px'
  tooltipEl.style.font = tooltip.options.bodyFont.string
  tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px'
}
