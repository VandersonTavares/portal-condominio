import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import jsPDF from 'jspdf'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface Reserva {
  id: string
  nomeCompleto: string
  apartamento: string
  bloco: string
  telefone: string
  dataReserva: Date
  tipoTaxa: 'morador' | 'parentes'
  valorTaxa: number
  status: 'aguardando' | 'pago' | 'cancelado'
  createdAt: Date
}

export const useReservasStore = defineStore('reservas', () => {
  const reservas = ref<Reserva[]>([
    {
      id: '1',
      nomeCompleto: 'João Silva Santos',
      apartamento: '101',
      bloco: 'A',
      telefone: '(61)99999-9999',
      dataReserva: new Date('2024-01-15'),
      tipoTaxa: 'morador',
      valorTaxa: 100,
      status: 'pago',
      createdAt: new Date('2023-12-20')
    },
    {
      id: '2',
      nomeCompleto: 'Maria Oliveira',
      apartamento: '205',
      bloco: 'B',
      telefone: '(61)88888-8888',
      dataReserva: new Date('2024-02-20'),
      tipoTaxa: 'parentes',
      valorTaxa: 300,
      status: 'aguardando',
      createdAt: new Date('2024-01-10')
    }
  ])

  const diasOcupados = computed(() => {
    return reservas.value.map(r => format(r.dataReserva, 'yyyy-MM-dd'))
  })

  const reservasPorMes = computed(() => {
    const meses: Record<string, Reserva[]> = {}
    
    reservas.value
      .sort((a, b) => a.dataReserva.getTime() - b.dataReserva.getTime())
      .forEach(reserva => {
        const mesAno = format(reserva.dataReserva, 'yyyy-MM')
        if (!meses[mesAno]) {
          meses[mesAno] = []
        }
        meses[mesAno].push(reserva)
      })

    return meses
  })

  const adicionarReserva = async (novaReserva: Omit<Reserva, 'id' | 'createdAt'>) => {
    const reserva: Reserva = {
      ...novaReserva,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    
    reservas.value.push(reserva)
    
    // Enviar notificação WhatsApp para o síndico
    await enviarNotificacaoWhatsApp(reserva)
    
    return reserva
  }

  const enviarNotificacaoWhatsApp = async (reserva: Reserva) => {
    const mensagem = `🏢 *NOVA RESERVA - SALÃO DE FESTAS*

👤 *Reserva feita no nome de:* ${reserva.nomeCompleto}
🏠 *Apartamento:* ${reserva.apartamento} - Bloco ${reserva.bloco}
📞 *Telefone:* ${reserva.telefone}
📅 *Data:* ${format(reserva.dataReserva, 'dd/MM/yyyy', { locale: ptBR })}
💰 *Taxa:* R$ ${reserva.valorTaxa.toFixed(2)} (${reserva.tipoTaxa})
📋 *Status:* ${reserva.status === 'aguardando' ? 'Aguardando pagamento' : 'Pago'}

Registrado na ata de reservas em ${format(reserva.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}`

    const numeroSindico = '5561983486146'
    const url = `https://wa.me/${numeroSindico}?text=${encodeURIComponent(mensagem)}`
    
    // Abrir WhatsApp em nova aba
    window.open(url, '_blank')
  }

  const gerarPDF = (mes?: string) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    
    // Header
    doc.setFillColor(41, 128, 185)
    doc.rect(0, 0, pageWidth, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.text('CONDOMÍNIO RESIDENCIAL', pageWidth / 2, 15, { align: 'center' })
    doc.text('RESERVAS DO SALÃO DE FESTAS', pageWidth / 2, 28, { align: 'center' })
    
    let yPosition = 60
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    
    if (mes) {
      const [ano, mesNum] = mes.split('-')
      const nomesMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ]
      doc.text(`RESERVAS DE ${nomesMeses[parseInt(mesNum) - 1]} DE ${ano}`, 20, yPosition)
      yPosition += 20
      
      const reservasMes = reservasPorMes.value[mes] || []
      reservasMes.forEach((reserva, index) => {
        doc.setFontSize(12)
        doc.text(`${index + 1}. ${format(reserva.dataReserva, 'dd/MM')} - ${reserva.nomeCompleto.split(' ')[0]} - Apt ${reserva.apartamento}${reserva.bloco}`, 20, yPosition)
        doc.text(`   Status: ${reserva.status} | Taxa: R$ ${reserva.valorTaxa}`, 25, yPosition + 8)
        yPosition += 20
      })
    } else {
      doc.text('TODAS AS RESERVAS POR MÊS', 20, yPosition)
      yPosition += 20
      
      Object.keys(reservasPorMes.value).forEach(mesAno => {
        const [ano, mesNum] = mesAno.split('-')
        const nomesMeses = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ]
        
        doc.setFontSize(14)
        doc.text(`${nomesMeses[parseInt(mesNum) - 1]} de ${ano}`, 20, yPosition)
        yPosition += 15
        
        const reservasMes = reservasPorMes.value[mesAno]
        reservasMes.forEach((reserva, index) => {
          doc.setFontSize(12)
          doc.text(`${index + 1}. ${format(reserva.dataReserva, 'dd/MM')} - ${reserva.nomeCompleto.split(' ')[0]} - Apt ${reserva.apartamento}${reserva.bloco}`, 25, yPosition)
          yPosition += 10
        })
        yPosition += 10
      })
    }
    
    // Footer
    doc.setFillColor(52, 73, 94)
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.text(`Relatório gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, pageWidth / 2, pageHeight - 8, { align: 'center' })
    
    const fileName = mes ? `reservas-${mes}.pdf` : 'reservas-completo.pdf'
    doc.save(fileName)
  }

  const atualizarStatusReserva = (id: string, novoStatus: Reserva['status']) => {
    const index = reservas.value.findIndex(r => r.id === id)
    if (index !== -1) {
      reservas.value[index].status = novoStatus
    }
  }

  const excluirReserva = (id: string) => {
    const index = reservas.value.findIndex(r => r.id === id)
    if (index !== -1) {
      reservas.value.splice(index, 1)
    }
  }

  return {
    reservas,
    diasOcupados,
    reservasPorMes,
    adicionarReserva,
    gerarPDF,
    atualizarStatusReserva,
    excluirReserva
  }
})