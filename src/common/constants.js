export const API_BASE_URL = ''

export const ATTACHMENT_DOWNLOAD_URL = '/api/attachment/download?forceDownload=1&attachmentId='
export const ATTACHMENT_SHOW_URL = '/api/attachment/download?attachmentId='
export const ATTACHMENT_THUMB_100_URL = '/api/attachment/thumbnail?maxWidth=100&maxHeight=100&attachmentId='

export const DEFAULT_LOCALE = 'zh_CN'

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
  SPREADSHEET: 5,
  GRAPH:       6,
}

export const ARTICLE_COMPONENT_MAP = {
  [ARTICLE_TYPE.RICHTEXT]:    'RichTextArticle',
  [ARTICLE_TYPE.MARKDOWN]:    'MarkdownArticle',
  [ARTICLE_TYPE.ATTACHMENT]:  'AttachmentArticle',
  [ARTICLE_TYPE.MIND]:        'MindArticle',
  [ARTICLE_TYPE.SPREADSHEET]: 'SpreadsheetArticle',
  [ARTICLE_TYPE.GRAPH]:       'GraphArticle',
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
  NONE:                 1,
  COPY_ARTICLES:        2,
  CUT_ARTICLES:         3,
  MIRROR_ARTICLES:      4
}

export const USER_STATUS = {
  NONE:          1,
  LOGGED_IN:     2,
  NOT_LOGGED_IN: 3
}

export const API_CODE = {
	SUCC              : 100,
  SYSTEM_ERROR      : 101,
  NOT_LOGGED_IN     : 102,
	PERMISSION_DENIED : 103,
	API_NOT_EXIST     : 104,
	INVALID_PARAM     : 105,
	ILLEGAL_OPERATION : 106,

  SPACE_NOT_EXIST : 1001,

	TREE_UPDATED    : 2001,
	TREE_NOT_EXIST  : 2002,

	ARTICLE_UPDATED : 3001,
	PAGE_UPDATED    : 3002,
	PAGE_NOT_EXIST  : 3003,

	SPACE_MENU_NOT_EXIST : 4001,

  DUPLICATE_EMAIL: 9001
}

export const ERROR_TYPE = {
  INVALID_SQL: 1000001,
}

export const PAGE_VERSION_CHECKING_INTERVAL = 60000
export const TREE_VERSION_CHECKING_INTERVAL = 60000

export const SEARCH_OBJECT_TYPE = {
  SPACE: 1,
  TREE_NODE: 2,
  ARTICLE: 3
}