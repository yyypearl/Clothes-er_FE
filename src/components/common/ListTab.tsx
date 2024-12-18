import {
  chatTabs,
  closetTabs,
  followTabs,
  myClosetTabs,
} from "@/data/tabsData";
import { theme } from "@/styles/theme";
import { useState } from "react";
import styled from "styled-components";
import { useCurrentTab } from "@/hooks/useCurrentTab";
import MyClosetContent from "../myCloset/MyClosetContent";
import MyShareContent from "../myCloset/MyShareContent";
import TransShareContent from "../myCloset/TransShareContent";
import TransRentContent from "../myCloset/TransRentContent";
import ChatListContent from "../chat/ChatListContent";
import StorageClosetContent from "../myCloset/StorageClosetContent";
import StorageRentalContent from "../myCloset/StorageRentalContent";
import FollowListContent from "../myCloset/FollowListContent";
import ClosetListContent from "../closet/ClosetListContent";

type listType = "me" | "other" | "chat" | "follow" | "closet";

interface ListTabProps {
  listType: listType;
  userSid?: string;
}

// 각 탭의 데이터 타입 정의
interface TabItem {
  tab: string;
  key: string;
  sub?: {
    subTab: string;
    key: string;
  }[];
}

const ListTab: React.FC<ListTabProps> = ({ listType, userSid }) => {
  // const router = useRouter();
  const { currentTab, setCurrentTab, currentSubTab, setCurrentSubTab } =
    useCurrentTab(listType);

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedSubTab, setSelectedSubTab] = useState<number>(0);

  // 탭 정보
  const tabsToDisplay: TabItem[] =
    listType === "closet"
      ? closetTabs
      : listType === "follow"
      ? followTabs
      : listType === "chat"
      ? chatTabs
      : listType === "other"
      ? [myClosetTabs[0]]
      : myClosetTabs;

  const handleTabClick = (tabIndex: number) => {
    setSelectedTab(tabIndex);
    setSelectedSubTab(0);
    if (listType === "closet") {
      const newTab = closetTabs[tabIndex].key;
      setCurrentTab(newTab);
      setCurrentSubTab("");
    } else if (listType === "chat") {
      const newTab = chatTabs[tabIndex].key;
      setCurrentTab(newTab);
      setCurrentSubTab("");
    } else if (listType === "follow") {
      const newTab = followTabs[tabIndex].key;
      setCurrentTab(newTab);
      setCurrentSubTab("");
    } else {
      const newTab = myClosetTabs[tabIndex].key;
      setCurrentTab(newTab);
      setCurrentSubTab(myClosetTabs[tabIndex].sub?.[0]?.key || "");
      // router.push(`/mycloset/${newTab}/${myClosetTabs[tabIndex].sub?.[0]?.key || ''}`);
    }
  };

  const handleSubTabClick = (subIndex: number) => {
    setSelectedSubTab(subIndex);
    const newSubTab = myClosetTabs[selectedTab].sub?.[subIndex]?.key || "";
    setCurrentSubTab(newSubTab);
    // router.push(`/mycloset/${myClosetTabs[selectedTab].key}/${newSubTab}`);
  };

  return (
    <Container>
      <ListContainer $listType={listType}>
        {tabsToDisplay.map((item, index) => (
          <Tab
            key={index}
            selected={selectedTab === index}
            onClick={() => handleTabClick(index)}
            $listType={listType}
          >
            {item.tab}
            {selectedTab === index && item.sub && (
              <SubTabs>
                {item.sub.map((list, subIndex) => (
                  <SubTab
                    key={subIndex}
                    selected={selectedSubTab === subIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubTabClick(subIndex);
                    }}
                  >
                    {list.subTab}
                  </SubTab>
                ))}
              </SubTabs>
            )}
          </Tab>
        ))}
      </ListContainer>
      <ContentArea
        currentTab={currentTab}
        currentSubTab={currentSubTab}
        userSid={userSid}
        listType={listType}
      />
    </Container>
  );
};

function ContentArea({
  currentTab,
  currentSubTab,
  userSid,
  listType,
}: {
  currentTab: string;
  currentSubTab: string;
  userSid?: string;
  listType?: string;
}) {
  if (currentTab === "my" && currentSubTab === "closet") {
    return <MyClosetContent userSid={userSid || ""} isMe={listType === "me"} />;
  } else if (currentTab === "my" && currentSubTab === "share") {
    return <MyShareContent userSid={userSid || ""} />;
  } else if (currentTab === "transaction" && currentSubTab === "sharing") {
    return <TransShareContent />;
  } else if (currentTab === "transaction" && currentSubTab === "rental") {
    return <TransRentContent />;
  } else if (currentTab === "storage" && currentSubTab === "closet") {
    return <StorageClosetContent />;
  } else if (currentTab === "storage" && currentSubTab === "rental") {
    return <StorageRentalContent />;
  } else if (currentTab === "rental") {
    return <ChatListContent type="rental" />;
  } else if (currentTab === "user") {
    return <ChatListContent type="user" />;
  } else if (currentTab === "follower") {
    return <FollowListContent type="follower" />;
  } else if (currentTab === "followee") {
    return <FollowListContent type="followee" />;
  } else if (currentTab === "all") {
    return <ClosetListContent type="all" />;
  } else if (currentTab === "follow") {
    return <ClosetListContent type="follow" />;
  }
  return null;
}

export default ListTab;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ListContainer = styled.div<{ $listType: listType }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 40px;
  border-bottom: 1px solid ${theme.colors.gray200};
  margin-bottom: ${({ $listType }) =>
    $listType === "chat" || $listType === "follow" ? "0px" : "30px"};
  gap: 20px;
`;

const Tab = styled.div<{ selected: boolean; $listType: listType }>`
  width: ${({ $listType }) => ($listType === "closet" ? "150px" : "77px")};
  padding: 5px 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ selected, theme }) =>
    selected ? theme.colors.purple500 : theme.colors.b100};
  border-bottom: 2px solid
    ${({ selected, theme }) =>
      selected ? theme.colors.purple500 : "transparent"};
  ${(props) => props.theme.fonts.b2_medium};
  position: relative;
  white-space: nowrap;
  cursor: pointer;
`;

const SubTabs = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  position: absolute;
  top: 38px;
  left: 50%;
  transform: translateX(-50%);
`;

const SubTab = styled.div<{ selected: boolean }>`
  color: ${({ selected, theme }) =>
    selected ? theme.colors.purple600 : theme.colors.b100};
  ${({ selected, theme }) =>
    selected ? theme.fonts.b3_bold : theme.fonts.b3_medium};
  cursor: pointer;
`;
