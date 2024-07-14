import type { Horse } from '@/store'

export default function generateHorseName(horses: Horse[]): string {
  const usedFirstNames = horses.map((horse) => horse.name.split(' ')[0])
  const usedLastNames = horses.map((horse) => horse.name.split(' ')[1])
  const firstNames = [
    'Turbo',
    'Aşksız',
    'Kafkaslı',
    'Yavuzhan',
    'Özgünhan',
    'Ayabakan',
    'Hafız',
    'Ateştopu',
    'Sakarbaşı',
    'Altaha',
    'Tamerinoğlu',
    'Haber',
    'Karaüzüm',
    'Demirkır',
    'Berkoş',
    'Beratlı',
    'Diliran',
    'Gümbürgümbür',
    'Çakmakhan',
    'Onurkaan',
    'Şampiyon',
    'Rüzgar',
    'Şah',
    'Efsane',
    'Zafer',
    'Berksoy',
    'Gözyaşı',
    'Ertuğrul',
    'Destan',
    'Doru',
    'Şimşek',
    'Günhan',
    'Sonbatu',
    "Kenan",
    'Kasırga',
    'Mavi',
    'Fırtına',
    'Cesur',
    'Alaz',
  ]

  const lastNames = [
    'Batur',
    'Bey',
    'Han',
    'Şah',
    'Sultan',
    'Prens',
    'Leopar',
    'Şimşek',
    'Fırtına',
    'Kılıç',
    'Cengiz',
    'Kara',
    'Demir',
    'Yakut',
    'Mercan',
    'İnci',
    'Savaş',
    'Barış',
    'Güneş',
    'Ay',
    'Kıtı',
    'Tınaz',
    'Dünya',
    'Evren',
    "Gazitepe",
    'Cennet',
    'Cehennem'
  ]

  const firstName = firstNames.filter((item) => !usedFirstNames.includes(item))[
    Math.floor(Math.random() * (firstNames.length - usedFirstNames.length))
  ]
  const lastName = lastNames.filter((item) => !usedLastNames.includes(item))[
    Math.floor(Math.random() * (lastNames.length - usedLastNames.length))
  ]
  return `${firstName} ${lastName}`
}
