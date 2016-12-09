---
layout: null
---

d3.json('{{ site.baseurl }}/assets/images/logos/sam.pikesley.org.svg.json', function(data) {
  // linear
  weighting = d3.scaleLinear()
                .domain([0, data.width])
                .range([0, 1])
  twoTone('linear', function(x) {
    return (0.5 > weighting(x))
  })
  twoTone('linear-fuzzed', function(x) {
    return (Math.random() > weighting(x))
  })

  // half-cos
  weighting = d3.scaleLinear()
                .domain([0, data.width])
                .range([Math.PI, 0])
  twoTone('half-cos', function(x) {
    return (0.5 > ((Math.cos(weighting(x)) + 1) / 2))
  })
  twoTone('half-cos-fuzzed', function(x) {
    return (Math.random() > ((Math.cos(weighting(x)) + 1) / 2))
  })

  // full cos
  weighting = d3.scaleLinear()
                .domain([0, data.width])
                .range([-Math.PI, Math.PI])
  twoTone('cos', function(x) {
    return (0.5 > ((Math.cos(weighting(x)) + 1) / 2))
  })
  twoTone('cos-fuzzed', function(x) {
    return (Math.random() > ((Math.cos(weighting(x)) + 1) / 2))
  })

  // multicolour
  weighting = d3.scaleQuantize()
                .domain([0, data.width])
                .range([0, 1, 2, 3, 4])

  mcs = [
    {% for group in site.data.colours.groups %}
    '{{ group }}',
    {% endfor %}
  ]

  for (i = 0; i < mcs.length; i++) {
    name = mcs[i]
    mc = render('multicolour-' + name)
    for (j = 0; j < 5; j++) {
      mc.classed(name + '-shade-' + j, function(d) {
        if (weighting(d.x) == j) {
          return true
        } else {
          return false
        }
      })
    }
  }

  function base(div) {
    return d3.select('#' + div)
             .append('div')
             .classed('svg-container', true)
             .append('svg')
             .attr('preserveAspectRatio', 'xMinYMin meet')
             .attr('viewBox', '0 0 ' + (data.width + 1) + ' ' + (data.height + 1))
             .classed('svg-content-responsive', true)
             .append('g')
  }

  function render(div, comparator) {
    return base(div).selectAll('rect')
                    .data(data.data)
                    .enter()
                    .append('rect')
                    .attr('x', function(d) {
                      return d.x
                    })
                    .attr('y', function(d) {
                      return d.y
                    })
                    .attr('height', 1)
                    .attr('width', 1)
                    .classed('pixel', true)
  }

  function twoTone(div, comparator) {
    render(div, comparator).classed('alt-pixel', function(d) {
      if (comparator(d.x)) {
        return true
      } else {
        return false
      }
    })
  }
})
