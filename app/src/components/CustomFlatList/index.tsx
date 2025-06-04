import React from 'react';
import { ListRenderItem } from 'react-native';
interface CustomFlatListProps {
  data: any[];
  renderItem: ListRenderItem<any>;
  keyExtractor: (item: any) => string;
}
const CustomFlatList = ({ data, renderItem }: CustomFlatListProps) => {
  return (
    <></>
  )
}

export default CustomFlatList;