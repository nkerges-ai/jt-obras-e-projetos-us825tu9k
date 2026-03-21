export const STANDARD_ACTIVITIES = [
  {
    id: 'alt',
    name: 'Trabalho em Altura (Fachada/Telhado)',
    risks: [
      {
        perigo: 'Queda de diferente nível',
        dano: 'Fraturas, traumatismo craniano, óbito',
        probabilidade: 'Média',
        severidade: 'Alta',
        nivelRisco: 'Alto',
        medidas:
          'Uso de cinto de segurança tipo paraquedista com duplo talabarte, linha de vida, isolamento da área.',
      },
      {
        perigo: 'Queda de materiais',
        dano: 'Lesões, contusões',
        probabilidade: 'Alta',
        severidade: 'Média',
        nivelRisco: 'Alto',
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
        probabilidade: 'Baixa',
        severidade: 'Alta',
        nivelRisco: 'Médio',
        medidas:
          'Desenergização do circuito, bloqueio e etiquetagem (LOTO), uso de EPIs dielétricos, ferramentas isoladas.',
      },
      {
        perigo: 'Arco elétrico',
        dano: 'Queimaduras severas, cegueira',
        probabilidade: 'Baixa',
        severidade: 'Alta',
        nivelRisco: 'Médio',
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
        probabilidade: 'Média',
        severidade: 'Média',
        nivelRisco: 'Médio',
        medidas: 'Uso de máscara com filtro para vapores orgânicos, ventilação constante do local.',
      },
      {
        perigo: 'Contato de produtos químicos com a pele',
        dano: 'Dermatites, alergias',
        probabilidade: 'Alta',
        severidade: 'Baixa',
        nivelRisco: 'Médio',
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
        probabilidade: 'Alta',
        severidade: 'Média',
        nivelRisco: 'Alto',
        medidas: 'Umidificação do local, uso obrigatório de máscara PFF2.',
      },
      {
        perigo: 'Ruído excessivo',
        dano: 'Perda auditiva induzida por ruído (PAIR)',
        probabilidade: 'Alta',
        severidade: 'Média',
        nivelRisco: 'Alto',
        medidas: 'Uso de protetor auricular (concha/plug), revezamento de tarefas.',
      },
      {
        perigo: 'Projeção de partículas',
        dano: 'Lesões oculares graves',
        probabilidade: 'Alta',
        severidade: 'Média',
        nivelRisco: 'Alto',
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
        probabilidade: 'Média',
        severidade: 'Alta',
        nivelRisco: 'Crítico',
        medidas:
          'Avaliação atmosférica, ventilação contínua, uso de detector de gases, emissão de PET e vigia treinado.',
      },
      {
        perigo: 'Explosão ou Incêndio',
        dano: 'Queimaduras graves, óbito',
        probabilidade: 'Baixa',
        severidade: 'Alta',
        nivelRisco: 'Alto',
        medidas:
          'Monitoramento de LEL, uso exclusivo de equipamentos intrinsecamente seguros (Ex).',
      },
    ],
  },
]
