import * as utils from './utils';
import { Fragment } from 'react';
import React from 'react';
import {Popover} from 'antd';

export const searchList = [
  {
    title: '指南简介',
    field: 'guideBrief',
    type: 'input',
  },
];

export const searchListProjectDetail = [
  {
    title: '试点单位',
    field: 'pilotUnit',
    type: 'input',
  },
  {
    title: '项目申请人',
    field: 'prjOwner',
    type: 'input',
  },
  {
    title: '工作单位',
    field: 'workCompany',
    type: 'input',
  },
];

export const ListColumns =  [
  {
    title: '序号',
    key: 'index',
    dataIndex: 'index',
    align: 'left',
    render: (text, record, index) => <span>{index + 1}</span>,
    width: 100,
  },
  {
    title: '指南名称',
    dataIndex: 'guideName',
    key: 'guideName',
    align: 'center',
    render: (record = "") => {
      let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
      if (data.length > 4) {
        data = data.substring(0, 3);
        data += "......"
      }
      return (
        <Popover
          content={record}
          autoAdjustOverflow
          mouseEnterDelay={0.2}
          placement='right'
        >
          <a>{data}</a>
        </Popover>
      )
    },
  },
  {
    title: '指南简介',
    dataIndex: 'guideBrief',
    key: 'guideBrief',
    align: 'center',
    render: (record = "") => {
      let data = record.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, '');
      if (data.length > 8) {
        data = data.substring(0, 7);
        data += "......"
      }
      return (
        <Popover
          content={record}
          autoAdjustOverflow
          mouseEnterDelay={0.2}
          placement='right'
        >
          <a>{data}</a>
        </Popover>
      )
    },
  },
  {
    title: '项目总量',
    dataIndex: 'amount',
    key: 'amount',
  },
];
