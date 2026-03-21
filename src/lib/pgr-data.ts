export const STANDARD_ACTIVITIES = [
  {
    id: 'alt',
    name: 'Trabalho em Altura (Fachada/Telhado)',
    risks: [
      {
        perigo: 'Queda de diferente nível',
        dano: 'Fraturas, traumatismo craniano, óbito',
        probabilidade: '2',
        severidade: '5',
        nivelRisco: 'Moderado',
        medidas:
          'Uso de cinto de segurança tipo paraquedista com duplo talabarte, linha de vida, isolamento da área.',
      },
      {
        perigo: 'Queda de materiais',
        dano: 'Lesões, contusões',
        probabilidade: '4',
        severidade: '3',
        nivelRisco: 'Moderado',
        medidas:
          'Uso de capacete, amarração de ferramentas, rodapés no andaime e tela de proteção.',
      },
    ],
  },
  {
    id: 'ele',
    name: 'Manutenção Elétrica',
    risks: [
      {
        perigo: 'Choque elétrico',
        dano: 'Queimaduras, parada cardiorrespiratória, óbito',
        probabilidade: '2',
        severidade: '5',
        nivelRisco: 'Moderado',
        medidas:
          'Desenergização do circuito, bloqueio e etiquetagem (LOTO), uso de EPIs dielétricos, ferramentas isoladas.',
      },
      {
        perigo: 'Arco elétrico',
        dano: 'Queimaduras severas, cegueira',
        probabilidade: '1',
        severidade: '5',
        nivelRisco: 'Tolerável',
        medidas: 'Uso de vestimenta FR (proteção contra arco), óculos e protetor facial.',
      },
    ],
  },
  {
    id: 'pin',
    name: 'Pintura e Manutenção Predial',
    risks: [
      {
        perigo: 'Inalação de vapores químicos',
        dano: 'Intoxicação, doenças respiratórias',
        probabilidade: '3',
        severidade: '3',
        nivelRisco: 'Tolerável',
        medidas: 'Uso de máscara com filtro para vapores orgânicos, ventilação constante do local.',
      },
      {
        perigo: 'Contato de produtos químicos com a pele',
        dano: 'Dermatites, alergias',
        probabilidade: '4',
        severidade: '2',
        nivelRisco: 'Tolerável',
        medidas: 'Uso de luvas de proteção (nitrílica/PVC), óculos de segurança e avental.',
      },
    ],
  },
  {
    id: 'civ',
    name: 'Obras Civis (Demolição/Alvenaria)',
    risks: [
      {
        perigo: 'Inalação de poeira mineral (Sílica)',
        dano: 'Doenças respiratórias',
        probabilidade: '4',
        severidade: '3',
        nivelRisco: 'Moderado',
        medidas: 'Umidificação do local, uso obrigatório de máscara PFF2.',
      },
      {
        perigo: 'Ruído excessivo',
        dano: 'Perda auditiva induzida por ruído (PAIR)',
        probabilidade: '4',
        severidade: '2',
        nivelRisco: 'Tolerável',
        medidas: 'Uso de protetor auricular (concha/plug), revezamento de tarefas.',
      },
      {
        perigo: 'Projeção de partículas',
        dano: 'Lesões oculares graves',
        probabilidade: '4',
        severidade: '3',
        nivelRisco: 'Moderado',
        medidas: 'Uso ininterrupto de óculos de segurança contra impactos.',
      },
    ],
  },
  {
    id: 'conf',
    name: 'Trabalho em Espaço Confinado',
    risks: [
      {
        perigo: 'Asfixia ou Intoxicação',
        dano: 'Asfixia, perda de consciência, óbito',
        probabilidade: '3',
        severidade: '5',
        nivelRisco: 'Substancial',
        medidas:
          'Avaliação atmosférica, ventilação contínua, uso de detector de gases, emissão de PET e vigia treinado.',
      },
      {
        perigo: 'Explosão ou Incêndio',
        dano: 'Queimaduras graves, óbito',
        probabilidade: '2',
        severidade: '5',
        nivelRisco: 'Moderado',
        medidas:
          'Monitoramento de LEL, uso exclusivo de equipamentos intrinsecamente seguros (Ex).',
      },
    ],
  },
  {
    id: 'psi',
    name: 'Fatores Psicossociais e Ergonomia (NR-01)',
    risks: [
      {
        perigo: 'Pressão por tempo / Ritmo intenso de trabalho',
        dano: 'Estresse ocupacional, ansiedade, fadiga mental',
        probabilidade: '3',
        severidade: '3',
        nivelRisco: 'Moderado',
        medidas:
          'Planejamento adequado das demandas, pausas programadas, ambiente colaborativo e apoio à saúde mental.',
      },
      {
        perigo: 'Trabalho isolado ou turnos extenuantes',
        dano: 'Síndrome de Burnout, distúrbios do sono, depressão',
        probabilidade: '2',
        severidade: '4',
        nivelRisco: 'Moderado',
        medidas:
          'Rodízio de turnos, monitoramento contínuo de bem-estar, feedbacks construtivos, treinamento de liderança.',
      },
    ],
  },
]
