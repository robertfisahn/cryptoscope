<template>
    <div class="q-mt-md q-pa-md bg-grey-1 rounded-borders shadow-2">
      <canvas ref="canvasRef" class="full-width" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, onUnmounted, ref, watch } from 'vue'
  import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'
  import type { ChartData } from 'chart.js'
  
  ChartJS.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend)
  
  const props = defineProps<{
    chartData: ChartData<'line'>
  }>()
  
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  let chartInstance: ChartJS<'line'> | null = null
  
  const renderChart = () => {
    if (canvasRef.value) {
      if (chartInstance) {
        chartInstance.destroy()
      }
      chartInstance = new ChartJS(canvasRef.value, {
        type: 'line',
        data: props.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#333'
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#666'
              }
            },
            y: {
              ticks: {
                color: '#666'
              }
            }
          }
        }
      })
    }
  }
  
  onMounted(() => {
    renderChart()
  })
  
  watch(() => props.chartData, () => {
    renderChart()
  })
  
  onUnmounted(() => {
    if (chartInstance) {
      chartInstance.destroy()
    }
  })
  </script>
  