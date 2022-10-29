import './index.scss'
import { View, Text, Picker, Button, Slider, Image } from '@tarojs/components'
import { AtCard, AtButton, AtTabBar, AtModal, AtModalContent, AtModalAction, AtList, AtListItem, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import { useState } from 'react';
import pic from './bottle.png';
import Taro, { useDidShow } from '@tarojs/taro'

const Index = () => {
  const [dataSource, setData] = useState([]);
  const getTimes = (ts?: string | number) => {
    const x = ts ?? new Date().getTime();
    const date = new Date(x);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const min = minutes >= 10 ? minutes : `0${minutes}`;
    return `${hour}:${min}`;
  }
  const [isOpened, setOpened] = useState(false);
  const [isActionOpend, setActionOpend] = useState(false);
  const [milkAmount, setMilkAmount] = useState(180);
  const [milkTime, setMilkTime] = useState('');
  const [currentData, setCurrentData] = useState({});

  const today = () => {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}/${m}/${d}`;
  }
  const tsToDate = (ts?: number) => {
    const x = ts ?? new Date().getTime();
    const date = new Date(x);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const w = date.getDay();
    const h = date.getHours();
    const ms = date.getMinutes();
    const weekMap = {
      1: '一',
      2: '二',
      3: '三',
      4: '四',
      5: '五',
      6: '六',
      7: '日',
    }
    return `${y}/${m}/${d} ${h}:${ms >= 10 ? ms : `0${ms}`}`
  }
  const dateToTs = (value: string) => {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const [h,ms] = value.split(':');
    const ds = `${y}/${m}/${d} ${h}:${+ms >= 10 ? ms : `0${ms}`}`;
    return new Date(ds).getTime()
  }
  const getDiffTime = (time: number) => {
    const now = new Date().getTime();
    const diff = now - time;
    const bh = diff/(60*60*1000)
    const dh = parseInt(`${bh}`);
    const dm = (bh-dh)*60;
    const minutes = parseInt(`${dm}`);
    return `${dh}小时${minutes}分前`;
  }
  const getTotalAmount = (data: any[]) => {
    return data.reduce((acc, next) => acc + next.amount, 0)
  }
  const uid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  const onMilkChange = (e: any) => {
    setMilkAmount(e.detail.value);
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
  }

  const sortData = dataSource.sort((a: any, b: any) => b.time - a.time);

  useDidShow(() => {
    const value = Taro.getStorageSync(`_${today()}_data_`);
    if (value) {
      setData(value);
    }
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
          <Text>奶量</Text><Slider min={10} max={280} showValue step={5} value={milkAmount} onChange={onMilkChange} />
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
          删除
        </AtActionSheetItem>
      </AtActionSheet>
    </View>
  )

}

export default Index;