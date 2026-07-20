import React, { useState } from "react";
import { Flex, Space, Table, Tag, message, Popconfirm, Modal } from "antd";
import type { TableProps } from "antd";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["kawaii"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const handleDelete = (record: DataType) => {
  console.log(record);
  message.open({
    type: "success",
    content: "删除成功",
  });
};

const Study: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, rowInfo) => (
        <a onClick={() => console.log(text, rowInfo)}>{text}</a>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <Flex gap="small" align="center" wrap>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "kawaii") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </Flex>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="medium">
          <a onClick={() => showModal(record)}>{record.name}</a>

          <Popconfirm
            placement="topLeft"
            title={"确认删除吗?"}
            description={"删除后将无法恢复"}
            okText="确认"
            cancelText="取消"
            onConfirm={() => handleDelete(record)}
            onCancel={() => console.log("取消删除")}
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showModal = (row) => {
    console.log(row);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Table<DataType> bordered columns={columns} dataSource={data} />

      {/* 弹窗 */}
      <Modal
        title="弹出对话框"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>对话框内容</p>
      </Modal>
    </div>
  );
};
export default Study;
