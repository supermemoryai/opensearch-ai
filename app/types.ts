export interface BingResults {
  query: Query;
  mixed: Mixed;
  type: string;
  web: Web;
}

export interface Query {
  original: string;
  show_strict_warning: boolean;
  is_navigational: boolean;
  is_news_breaking: boolean;
  spellcheck_off: boolean;
  country: string;
  bad_results: boolean;
  should_fallback: boolean;
  postal_code: string;
  city: string;
  header_country: string;
  more_results_available: boolean;
  state: string;
}

export interface Mixed {
  type: string;
  main: Main[];
  top: any[];
  side: any[];
}

export interface Main {
  type: string;
  index: number;
  all: boolean;
}

export interface Web {
  type: string;
  results: Result[];
  family_friendly: boolean;
}

export interface Result {
  title: string;
  url: string;
  is_source_local: boolean;
  is_source_both: boolean;
  description: string;
  profile: Profile;
  language: string;
  family_friendly: boolean;
  type: string;
  subtype: string;
  meta_url: MetaUrl;
  thumbnail?: Thumbnail;
  page_age?: string;
  age?: string;
}

export interface Profile {
  name: string;
  url: string;
  long_name: string;
  img: string;
}

export interface MetaUrl {
  scheme: string;
  netloc: string;
  hostname: string;
  favicon: string;
  path: string;
}

export interface Thumbnail {
  src: string;
  original: string;
  logo: boolean;
}
