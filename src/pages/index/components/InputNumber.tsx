import { View, Text } from "@tarojs/components";
import './index.scss';
import { useEffect, useState } from 'react';
import Taro  from '@tarojs/taro';

interface IProps {
  value: number
  max: number
  min: number
  onChange: (value: number) => void
  step: number
  unit?: string
}

const InputNumber = (props: IProps) => {
  const {value, max, min, step, onChange, unit } = props;
  const [val, setVal] = useState(value); 
  const onMinus = () => {
    Taro.vibrateShort({
      type: 'medium'
    });
    const v = val - step < min ? min : val - step;
    setVal(v)
    onChange(v);
  }
  const onPlus = () => {
    Taro.vibrateShort({
      type: 'medium'
    });
    const v = val + step > max ? max : val + step;
    setVal(v)
    onChange(v);
  }

  useEffect(() => {
    setVal(props.value)
  }, [props.value])

  return (
    <View>
      <View className="at-input-number">
      <View className="at-input-number__btn" onClick={onMinus}>
        <Text className="at-icon at-icon-subtract at-input-number__btn-subtract" />
      </View>
      <Text className="at-input-number__input">{val}</Text>
      <View className="at-input-number__btn" onClick={onPlus}>
        <Text className="at-icon at-icon-add at-input-number__btn-add"/>
      </View>
    </View>
    {
      unit && 
      <>
        &nbsp;
        <Text style={{verticalAlign: 'bottom'}}>{unit}</Text>
      </>
    }
    </View>
  )

}
export default InputNumber;