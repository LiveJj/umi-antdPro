import React, { useEffect, useState, useCallback } from 'react';
import { Row, Input, Avatar, Image, Button } from 'antd';
import { searchUsers } from '@/services/userLogin';

const SearchUsers = () => {
  const [dataList, setdataList] = useState([]);
  let [num, setNum] = useState(30);
  useEffect(() => {
    if (num == 30) return;
    if (num == 0) return setNum(30);
    const id = setInterval(count, 1000);
    return () => clearInterval(id);
  }, [count, num]);
  const gitHubSearch = async (value, event) => {
    const res = await searchUsers({ q: value });
    setdataList(res.items);
  };
  const count = useCallback((value, event) => setNum(--num), [num]);
  return (
    <div style={{ padding: '20px 30px' }}>
      <Input.Group compact size="large">
        <Input style={{ width: 'calc(100% - 150px)' }} placeholder="一个简单的获取验证码功能" />
        <Button type="primary" onClick={count} size="large" disabled={num !== 30 ? true : false}>
          {num == 30 ? '获取验证码' : num + '秒后重新获取'}
        </Button>
      </Input.Group>
      <Input.Search onSearch={gitHubSearch} enterButton placeholder="搜索GitHub用户" size="large" />
      <Row gutter={[16, 48]} style={{ marginTop: 30 }}>
        {dataList?.map((item) => (
          <Avatar
            key={item.id}
            size={{ xs: 48, sm: 60, md: 76, lg: 96, xl: 120, xxl: 150 }}
            src={<Image src={item.avatar_url} />}
          />
        ))}
      </Row>
    </div>
  );
};

export default SearchUsers;
