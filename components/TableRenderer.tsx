import dayjs from "dayjs";
import Tag from "antd/lib/tag";

const formatNumber = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export function TableRenderer(array: any) {
  let rry = array.map((item: any, idx: any) => {
    return item?.title?.toLowerCase()?.split(" ")?.includes("id")
      ? {}
      : {
          title: item.title,
          dataIndex: item.dataIndex,
          key: item.key,
          sorter: item.sorter,
          render:
            item.dataIndex === "rcvd_time" ||
            item.dataIndex === "date_processed" ||
            item.dataIndex === "received_date"
              ? (x: any) => `${dayjs(x).format("DD/MM/YYYY HH:mm:ss")}`
              : item.dataIndex === "birthdate"
              ? (x: any) => `${dayjs(x).format("DD/MM/YYYY")}`
              : item.dataIndex === "created_at"
              ? (x: any) => `${dayjs(x).format("DD/MM/YYYY HH:mm:ss")}`
              : item.dataIndex === "status"
              ? (x: string) =>
                  x == "0" ? (
                    <Tag color="warning">UNPROCESSED</Tag>
                  ) : x == "1" ? (
                    <Tag color="warning">PROCESSED</Tag>
                  ) : x == "2" ? (
                    <Tag color="success">SUCCESS</Tag>
                  ) : x == "4" ? (
                    <Tag color="warning">PENDING</Tag>
                  ) : (
                    <Tag color="error">FAILED</Tag>
                  )
              : item.dataIndex === "date"
              ? (x: any) => `${dayjs(x).format("YYYY-MM-DD HH:mm")}`
              : null,
        };
  });
  return rry;
}
