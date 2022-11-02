import './index.scss'
import { View, Text, Picker, Button, Slider, Image, Input } from '@tarojs/components'
import { AtCard, AtButton, AtTabBar, AtModal, AtModalContent, AtModalAction, AtList, AtListItem, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import { useState } from 'react';
import pic from './bottle.png';
import Taro, { useDidShow } from '@tarojs/taro';
import { getTimes, today, tsToDate, dateToTs, getDiffTime, uid } from '../../utils';

const Index = () => {
  const [dataSource, setData] = useState([]);
  const [isOpened, setOpened] = useState(false);
  const [isActionOpend, setActionOpend] = useState(false);
  const [milkAmount, setMilkAmount] = useState(180);
  const [milkTime, setMilkTime] = useState('');
  const [currentData, setCurrentData] = useState({});

  const getTotalAmount = (data: any[]) => {
    return data.reduce((acc, next) => acc + next.amount, 0)
  }

  const onMilkChange = (e: any) => {
    setMilkAmount(+e.detail.value);
  }
  const onPickerChange = (e: any) => {
    setMilkTime(e.detail.value);
  }
  const onModalCancel = () => {
    setOpened(false);
    setMilkAmount(180);
    setMilkTime(getTimes());
  }
  const onConfirm = () => {
    const d: any = {
      time: dateToTs(milkTime),
      amount: milkAmount,
      id: uid()
    }
    const temp: any[] = dataSource;
    const t = temp.filter(d => d.id !== currentData.id);
    t.push(d);
    setData(t as any);
    Taro.setStorageSync(`_${today()}_data_`, t);
    onModalCancel();
  }
  const onClickFeed = () => {
    setOpened(true);
    setMilkTime(getTimes());
  }
  const onClickCard = (v: any) => {
    setActionOpend(true);
    setCurrentData(v);
  }
  const onActionClose = () => {
    setActionOpend(false);
  }

  const onEdit = () => {
    setActionOpend(false);
    setOpened(true);
    setMilkAmount(currentData.amount);
    setMilkTime(getTimes(currentData.time));
  }
  const onDelete = () => {
    setActionOpend(false);
    const temp = dataSource;
    const d = temp.filter(d => d.id !== currentData.id);
    setData(d);
    Taro.setStorageSync(`_${today()}_data_`, d);
    Taro.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000
    })
  }

  const sortData = dataSource.sort((a: any, b: any) => b.time - a.time);

  useDidShow(() => {
    const value = Taro.getStorageSync(`_${today()}_data_`);
    if (value) {
      setData(value);
    }
    Taro.showShareMenu({
      withShareTicket: true,
      showShareItems: ['wechatFriends', 'shareAppMessage', 'shareTimeline', 'wechatMoment']
    })
  })

  return (
    <View className="wrapper">
      <Text className="today">{tsToDate()}</Text>
      <AtButton className="total">喂奶{dataSource.length}次，{getTotalAmount(dataSource)}ml</AtButton>
      {
        sortData.length === 0 && <Image src={pic} style={{margin: '0 auto', display: 'block'}}/>
      }
      <View className="scroll-view">
      {
        sortData.map((item: any) => (
          <AtCard
            onClick={() => onClickCard(item)}
            className="at-card-content"
            key={item.id}
            note={tsToDate(item.time)}
            extra={getDiffTime(item.time)}
            title={`喂奶粉`}
            extraStyle={{
              fontSize: 12,
              maxWidth: 200,
              color: `rgb(97, 144, 232)`,
            }}
          >
            奶量：{item.amount}ml
          </AtCard>
        ))
      }
      </View>
      <AtTabBar
        fixed
        tabList={[
          { title: '记喂奶', iconType: 'add' },
        ]}
        onClick={onClickFeed}
        current={0}
      />
      <AtModal isOpened={isOpened} closeOnClickOverlay={false}>
        <AtModalContent>
          <View className="milk-amount-view">
            <View className="milk-text">奶量</View>
            <Input type="number" value={`${milkAmount}`} onInput={onMilkChange} />
            &nbsp;
            <Text>ml</Text>
          </View>
          <Picker mode='time' onChange={onPickerChange} end={milkTime}>
            <AtList>
              <AtListItem title='请选择时间' extraText={milkTime} />
            </AtList>
          </Picker>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={onModalCancel}>取消</Button>
          <Button onClick={onConfirm}>确定</Button>
        </AtModalAction>
      </AtModal>
      <AtActionSheet isOpened={isActionOpend} onCancel={onActionClose} onClose={(onActionClose)}>
        <AtActionSheetItem onClick={onEdit}>
          编辑
        </AtActionSheetItem>
        <AtActionSheetItem onClick={onDelete}>
          <Text style={{color: 'red'}}>删除</Text>
        </AtActionSheetItem>
      </AtActionSheet>
    </View>
  )

}

export default Index;