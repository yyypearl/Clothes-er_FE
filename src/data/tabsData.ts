export const tabs = [
  { path: "/home", icon: "ic_home", label: "홈" },
  { path: "/chat", icon: "ic_chat", label: "채팅" },
  { path: "/closet", icon: "ic_closet", label: "옷장 구경" },
  { path: "/mycloset", icon: "ic_my", label: "나의 옷장" },
];

export const myClosetTabs = [
  { 
    tab: "보유", 
    key: "my", 
    sub: [
      { subTab: "옷장", key: "closet" },
      { subTab: "공유 등록", key: "share" }
    ]
  },
  { 
    tab: "거래 현황", 
    key: "transaction", 
    sub: [
      { subTab: "공유", key: "sharing" },
      { subTab: "대여", key: "rental" }
    ]
  },
  { 
    tab: "찜", 
    key: "storage",
    sub: [
      { subTab: "옷장", key: "closet" },
      { subTab: "대여", key: "rental" }
    ]
  }
];

export const chatTabs = [
  {
    tab: "대여글",
    key: "rental",
  },
  {
    tab: "유저",
    key: "user",
  }
]

export const followTabs = [
  {
    tab: "팔로워",
    key: "follower",
  },
  {
    tab: "팔로잉",
    key: "followee",
  }
]

export const closetTabs = [
  {
    tab: "둘러보기",
    key: "all",
  },
  {
    tab: "팔로잉 하는 옷장",
    key: "follow",
  },
];