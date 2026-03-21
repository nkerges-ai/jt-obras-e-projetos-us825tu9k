export const STANDARD_ACTIVITIES = [
  {
    id: 'alt',
    name: 'Trabalho em Altura (Fachada/Telhado)',
    risks: [
      {
        perigo: 'Queda de diferente nível',
        dano: 'Fraturas, traumatismo craniano, óbito',
        medidas:
          'Uso de cinto de segurança tipo paraquedista com duplo talabarte, linha de vida, isolamento da área.',
      },
      {
        perigo: 'Queda de materiais',
        dano: 'Lesões, contusões',
        medidas: 'Uso de capacete, amarração de ferramentas, rodapés no andaime.',
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
        medidas:
          'Desenergização do circuito, bloqueio e etiquetagem (LOTO), uso de EPIs dielétricos, ferramentas isoladas.',
      },
      {
        perigo: 'Arco elétrico',
        dano: 'Queimaduras severas, cegueira',
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
        medidas: 'Uso de máscara com filtro para vapores orgânicos, ventilação do local.',
      },
      {
        perigo: 'Contato de produtos químicos com a pele',
        dano: 'Dermatites, alergias',
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
        medidas: 'Umidificação do local, uso de máscara PFF2.',
      },
      {
        perigo: 'Ruído excessivo',
        dano: 'Perda auditiva induzida por ruído (PAIR)',
        medidas: 'Uso de protetor auricular, revezamento de tarefas.',
      },
      {
        perigo: 'Projeção de partículas',
        dano: 'Lesões oculares',
        medidas: 'Uso de óculos de segurança contra impactos.',
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
        medidas:
          'Avaliação atmosférica, ventilação contínua, uso de detector de gases e vigia treinado.',
      },
      {
        perigo: 'Explosão ou Incêndio',
        dano: 'Queimaduras graves, óbito',
        medidas: 'Monitoramento de LEL, uso de equipamentos intrinsecamente seguros (Ex).',
      },
    ],
  },
]
