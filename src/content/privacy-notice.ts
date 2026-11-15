/**
 * 個資蒐集告知（M1 AC-005）。
 *
 * 這是依 PRD/SPEC.md §8 列出的必要項目撰寫的草稿，不是法律意見；
 * 確切文字、利用期間與行使權利的聯絡方式都必須由 Sean 或法務確認後才能正式使用。
 */
export const PRIVACY_NOTICE = {
  title: '個人資料蒐集告知',
  version: 'v0.1 草稿',
  reviewStatus: '待 Sean／法務確認',
  sections: [
    {
      id: 'purpose',
      heading: '蒐集目的',
      body: '回覆你的諮詢，並與你安排會談。',
    },
    {
      id: 'categories',
      heading: '資料類別',
      body: '姓名、Email、公司名稱、公司規模、需求類型、預估人數（選填）與需求說明。',
    },
    {
      id: 'usage',
      heading: '利用期間與方式',
      body: '僅在回覆諮詢與安排會談的必要期間內，由本服務用來以 Email 或線上會議與你聯繫，不會提供給第三方。確切的保存期限、利用地區與對象將於正式開放前載明。',
    },
    {
      id: 'rights',
      heading: '當事人權利',
      body: '你可以請求查詢或閱覽、製給複本、補充或更正、停止蒐集、處理或利用，以及刪除你的個人資料。行使權利的聯絡方式將於正式開放前載明。',
    },
    {
      id: 'optional',
      heading: '不提供資料的影響',
      body: '你可以自由選擇是否提供；若不提供必填欄位，我們將無法回覆你的諮詢或安排會談。',
    },
  ],
  testModeNote: '目前為測試模式：送出表單不會傳送或儲存任何資料。',
  consentLabel: '我已閱讀並同意上述個人資料蒐集告知',
} as const;
