// Цей тип ми будемо використовувати скрізь для багатомовних полів
export type LocalizedString = {
  en: string;
  ru: string;
};

// Оновлений тип нашого Агента
export type Agent = {
  id: string;
  title: LocalizedString;
  description_md: LocalizedString;
  price: number;
  icon_url: string;
  status: string;
  created_at: string;
};