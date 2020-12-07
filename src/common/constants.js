export const API_BASE_URL = 'http://www.smoothwiki.com'
export const API_CODE_SUCC = 100

export const TREE_ID = {
  MAIN:  1,
  TRASH: 2
}

export const NODE_TYPE = {
  ARTICLE_PAGE: 0,
  DISCUSSTION_PAGE: 1
}

export const ARTICLE_TYPE = {
  RICHTEXT:    1,
  MARKDOWN:    2,
  ATTACHMENT:  3,
  MIND:        4,
  PDF:         5
}

export const ARTICLE_COMPONENT_MAP = {
  [ARTICLE_TYPE.RICHTEXT]:   'RichTextArticle',
  [ARTICLE_TYPE.MARKDOWN]:   'MarkdownArticle',
  [ARTICLE_TYPE.ATTACHMENT]: 'AttachmentArticle',
  [ARTICLE_TYPE.MIND]:       'MindArticle',
  [ARTICLE_TYPE.PDF]:        'PdfArticle'
}

export const PAGE_STATUS = {
  INITED:      1,
  FAILED_PULL: 2,
  SUCC_PULL:   3,
  NOT_EXIST:   4
}