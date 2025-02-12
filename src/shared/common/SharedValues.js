import { Fragment } from "react";

export const COMMON_VALUES = {
  alertClass: {
    danger: "danger",
    success: "success",
  },

  tableSummaryFormat: [
    {
      duration: "Today",
      amount: 0,
      data: [],
    },
    {
      duration: "Last 7 days",
      amount: 0,
      data: [],
    },
    {
      duration: "Last 30 days",
      amount: 0,
      data: [],
    },
    {
      duration: "Last 60 days",
      amount: 0,
      data: [],
    },
    {
      duration: "Last 90 days",
      amount: 0,
      data: [],
    },
    {
      duration: "Last 180 days",
      amount: 0,
      data: [],
    },
    {
      duration: "Last 365 days",
      amount: 0,
      data: [],
    },
    {
      duration: "All time",
      amount: 0,
      data: [],
    },
  ],

  homeIntroFormat: [
    { name: "Total results: ", value: 0 },
  ],

  othersIntroFormat: [{ name: "Total: ", value: 0 }],

  othersTableBody: (
    <Fragment>
      <tr>
        <td>1</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
      </tr>
      <tr>
        <td>2</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
      </tr>
      <tr>
        <td>3</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
      </tr>
      <tr>
        <td>4</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
      </tr>
      <tr>
        <td>5</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
      </tr>
      <tr>
        <td>6</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
      </tr>
      <tr>
        <td>7</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
      </tr>
      <tr>
        <td>8</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
      </tr>
      <tr>
        <td>9</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
      </tr>
      <tr>
        <td>10</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
      </tr>
    </Fragment>
  ),

  pageInfoFormat: {
    currentPage: 1,
    itemResults: [],
    totalPage: 1,
    totalItems: 0,
  },
};
