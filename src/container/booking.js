import React, { useEffect, useState } from "react";
import { Select, Form, InputNumber } from "antd";
import "./booking.css";

const getOptions = (total) => {
  let result = [];
  for (let i = 0; i <= total; i++) {
    result.push({
      value: i,
      label: i.toString(),
    });
  }
  return result;
};

function Booking() {
  const optionMaximum = 20;
  const [listNumber, setListNumber] = useState(1);
  const [listContent, setListContent] = useState([]);
  const [optionContent, setOptionContent] = useState(getOptions(optionMaximum));
  const [ageStart, setAgeStart] = useState([]);
  const [ageEnd, setAgeEnd] = useState([]);
  const [price, setPrice] = useState([]);
  const [seletDisabled, setSelectDisabled] = useState([false]);
  const [removeIndex, setRemoveIndex] = useState("");
  const [checkAgeIndex, setCheckAgeIndex] = useState(1);
  const [inputForm] = Form.useForm();
  const [optionForm] = Form.useForm();

  useEffect(() => {
    if (!removeIndex) {
      let list = JSON.parse(JSON.stringify(listContent));

      for (let i = 0; i < listNumber; i++) {
        list[i] = {
          index: i,
          ageStart: ageStart[i] ?? "",
          ageEnd: ageEnd[i] ?? "",
          price: price[i] ?? "",
        };
      }
      setListContent(list);

      let disabled = JSON.parse(JSON.stringify(seletDisabled));
      const disabledIndex = list.findIndex((v) => {
        return v.ageStart === "" || v.ageEnd === "" || v.price === "";
      });

      for (let i = 0; i < listNumber; i++) {
        if (i > disabledIndex) {
          disabled[i] = true;
        } else {
          disabled[i] = false;
        }

        // 當找不到disable的清單時，表示頁面上所有的資料已填，設disabled = false
        if (disabledIndex === -1) {
          disabled[i] = false;
        }
      }

      setSelectDisabled(disabled);
    }
  }, [listNumber, optionContent]);

  useEffect(() => {
    if (removeIndex) {
      let list = listContent.filter((v) => v.index !== removeIndex);

      for (let i = 0; i < list.length; i++) {
        list[i].index = i;
      }

      let tempAgeStart = JSON.parse(JSON.stringify(ageStart));
      let tempAgeEnd = JSON.parse(JSON.stringify(ageEnd));
      let tempPrice = JSON.parse(JSON.stringify(price));

      tempAgeStart.splice(removeIndex, 1);
      tempAgeEnd.splice(removeIndex, 1);
      tempPrice.splice(removeIndex, 1);

      setAgeStart(tempAgeStart);
      setAgeEnd(tempAgeEnd);
      setPrice(tempPrice);

      setListContent(list);
      setListNumber((priceSetNumber) => priceSetNumber - 1);
    }
  }, [removeIndex]);

  // 新增或移除表單時, 需重設選單的年齡
  useEffect(() => {
    if (listContent.length > 0) {
      let ageUpdate = {};
      let priceUpdate = {};

      for (let i = 0; i < listContent.length; i++) {
        ageUpdate[`age_option_start_${i}`] = listContent[i].ageStart;
        ageUpdate[`age_option_end_${i}`] = listContent[i].ageEnd;
        priceUpdate[`number_input_${i}`] = listContent[i].price;
      }

      optionForm.setFieldsValue(ageUpdate);
      inputForm.setFieldsValue(priceUpdate);
    }
  }, [listContent]);

  // 處理disabled的選項
  useEffect(() => {
    // 確保先讓所有選項可以選取
    let option = JSON.parse(JSON.stringify(optionContent));
    for (const element of option) {
      element.disabled = false;
    }

    // 根據已設定過的選項，將其設定為disabled
    const isUsedArray = ageStart.concat(ageEnd);
    for (const element of isUsedArray) {
      option[element].disabled = true;
    }
    setOptionContent(option);
  }, [ageStart, ageEnd, price]);

  const addOptions = (e) => {
    e.preventDefault();
    setListNumber((priceSetNumber) => priceSetNumber + 1);
    setRemoveIndex("");
  };

  const removeOptions = (e) => {
    e.preventDefault();

    const listIndex = parseInt(e.target.dataset.listIndex);
    setRemoveIndex(listIndex);
  };

  const getListByCount = (optionContent, removeOptions) => {
    const checkAge = (rule, value, callback) => {
      if (listNumber === 1) {
        return;
      }

      for (let i = 0; i < listNumber; i++) {
        if (i === checkAgeIndex) continue;
        // if (ageStart[i] !== undefined && ageEnd[i] !== undefined) {
        const orderArray = [ageStart[i], ageEnd[i]];
        orderArray.sort((a, b) => a - b);

        if (orderArray[0] <= value && value <= orderArray[1]) {
          callback("不可以選取重複的區間"); // 校验失败，返回错误信息
        }
        // }
      }
    };

    const checkPrice = (input) => {
      inputForm.validateFields([input]);
    };

    const handlePriceChange = (index) => {
      let tempPrice = JSON.parse(JSON.stringify(price));
      tempPrice[index] = inputForm.getFieldValue(`number_input_${index}`);
      setPrice(tempPrice);
    };

    const handleAgeChange = (from, index) => {
      // 檢查上一個清單的費用
      checkPrice(`number_input_${index - 1}`);

      if (from === "start") {
        let tempStart = JSON.parse(JSON.stringify(ageStart));
        tempStart[index] = optionForm.getFieldValue(
          `age_option_start_${index}`
        );
        setAgeStart(tempStart);
      } else if (from === "end") {
        let tempEnd = JSON.parse(JSON.stringify(ageEnd));
        tempEnd[index] = optionForm.getFieldValue(`age_option_end_${index}`);
        setAgeEnd(tempEnd);
      }

      setCheckAgeIndex(index);
    };

    const result = listContent.map((v) => {
      return (
        <div key={v.index}>
          <div className="flex-between">
            <div className="option-title">價格設定 - {v.index + 1}</div>
            {v.index !== 0 && (
              <a
                href="/"
                className="remove-setting flex-between"
                onClick={removeOptions}
                data-list-index={v.index}
              >
                <span
                  className="material-symbols-outlined"
                  data-list-index={v.index}
                >
                  close
                </span>{" "}
                移除
              </a>
            )}
          </div>

          <div className="flex-between">
            <div className="option-border">
              <div>年齡</div>
              <Form form={optionForm}>
                <div className="option-area">
                  <Form.Item
                    name={`age_option_start_${v.index}`}
                    rules={[
                      {
                        validator: checkAge,
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      style={{ width: 150 }}
                      disabled={seletDisabled[v.index]}
                      options={optionContent}
                      onChange={() => handleAgeChange("start", v.index)}
                    />
                  </Form.Item>
                  <div className="between-text flex-center">～</div>
                  <Form.Item
                    name={`age_option_end_${v.index}`}
                    rules={[
                      {
                        validator: checkAge,
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      style={{ width: 150 }}
                      disabled={seletDisabled[v.index]}
                      options={optionContent}
                      onChange={() => handleAgeChange("end", v.index)}
                    />
                  </Form.Item>
                </div>
              </Form>
            </div>

            <div className="option-border">
              <div>入住費用(每人每晚)</div>
              <div className="flex-between option-area">
                <Form form={inputForm}>
                  <Form.Item
                    name={`number_input_${v.index}`}
                    rules={[
                      {
                        required: true,
                        message: "不可以為空白",
                      },
                    ]}
                  >
                    <InputNumber
                      size="large"
                      addonBefore="TWD"
                      disabled={seletDisabled[v.index]}
                      min={0}
                      style={{ width: 350 }}
                      onBlur={() => checkPrice(`number_input_${v.index}`)}
                      onChange={() => handlePriceChange(v.index)}
                      formatter={(value) =>
                        value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Form>
              </div>

              <div className="text-right">輸入0表示免費</div>
            </div>
          </div>
          <hr />
        </div>
      );
    });

    return result;
  };

  return (
    <div className="frame">
      <a href="/" className="add-setting flex-between" onClick={addOptions}>
        <span className="material-symbols-outlined">add</span> 新增價格設定
      </a>
      {getListByCount(optionContent, removeOptions)}
    </div>
  );
}

export default Booking;
