export const API_BASE_URL = 'http://www.smoothwiki.com'
export const API_CODE_SUCC = 100

export const ATTACHMENT_DOWNLOAD_URL = 'http://www.smoothwiki.com/api/attachment/download?forceDownload=1&attachmentId='
export const ATTACHMENT_SHOW_URL = 'http://www.smoothwiki.com/api/attachment/download?attachmentId='

export const TREE_ID = {
  MAIN:  1,
  TRASH: 2
}

export const NODE_TYPE = {
  ARTICLE_PAGE:     1,
  DISCUSSTION_PAGE: 2,
  API_PAGE:         3,
  MOCK_PAGE:        4
}

export const PAGE_TYPE = {
  ARTICLE_PAGE: 1
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

export const SPACE_TYPE = {
  PERSON:  1,
  GROUP:   2,
  PROJECT: 3
}

export const SPACE_MEMBER_ROLE = {
  CREATOR:  1,
  ADMIN:    2,
  ORDINARY: 3
}

export const CLIPBOARD_STATUS = {
  NONE:                1,
  COPY_ARTICLE:        2,
  CUT_ARTICLE:         3,
  COPY_ARTICLE_MIRROR: 4
}