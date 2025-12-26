
export interface MemeTemplate {
  id: string;
  url: string;
}

export interface MemeState {
  imageUrl: string;
  topText: string;
  bottomText: string;
  fontSize: number;
  textColor: string;
}

export interface SuggestedCaption {
  top: string;
  bottom: string;
}
