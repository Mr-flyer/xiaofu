module.exports = {
  types: [
    {
      type: "radio",
      title: "性别",
      description: "",
      required: true,
      goto: "",
      blank_setting: [],
      hidden: false,
      prefill: false,
      random: false,
      maxRow: "1",
      refer: null,
      options: [
        {
          id: "o-100-ABCD",
          goto: "",
          display: [],
          noRandom: false,
          text: "男生"
        },
        {
          id: "o-101-EFGH",
          goto: "",
          display: [],
          noRandom: false,
          text: "女生"
        }
      ],
      id: "q-01-sex"
    },
    {
      type: "radio",
      title: "尺码",
      description: "",
      required: true,
      goto: "",
      blank_setting: [],
      hidden: false,
      prefill: false,
      random: false,
      maxRow: "1",
      refer: null,
      options: [
        {
          id: "o-100-ABCD",
          goto: "",
          display: [],
          noRandom: false,
          text: "XS"
        },
        {
          id: "o-101-EFGH",
          goto: "",
          display: [],
          noRandom: false,
          text: "S"
        },
        {
          id: "o-2-KLAS",
          goto: "",
          display: [],
          noRandom: false,
          text: "M"
        },
        {
          id: "o-3-FGrJ",
          goto: "",
          display: [],
          noRandom: false,
          text: "L"
        }
      ],
      id: "q-02-size"
    },
    {
      type: "radio",
      title: "款式",
      description: "",
      required: true,
      goto: "",
      blank_setting: [],
      hidden: false,
      prefill: false,
      random: false,
      maxRow: "1",
      refer: null,
      options: [
        {
          id: "o-100-ABCD",
          goto: "",
          display: [],
          noRandom: false,
          text: "短袖"
        },
        {
          id: "o-101-EFGH",
          goto: "",
          display: [],
          noRandom: false,
          text: "短裤"
        },
        {
          id: "o-2-KLAS",
          goto: "",
          display: [],
          noRandom: false,
          text: "长袖"
        },
        {
          id: "o-3-FGrJ",
          goto: "",
          display: [],
          noRandom: false,
          text: "长裤"
        },
        {
          id: "o-4-JtrA",
          goto: "",
          display: [],
          noRandom: false,
          text: "长裙"
        }
      ],
      id: "q-03-style"
    },
  ]
}