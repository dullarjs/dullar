<!--
 * @Author: yegl
 * @Date: 2021-08-02 18:49:02
 * @Last Modified by: yegl
 * @Last Modified time: 2021-09-22 15:03:09
 * @E-mail: yglgzyx@126.com
-->
<template>
    <div>
        <h2>yn-pagination</h2>
        <yn-pagination
            v-on:pageSizeChange="handlePageSizeChange"
            v-on:pageChange="handlePageChange"
            :total="one.total"
            :defaultPageSize="one.pageSize"
            :defaultCurrent="one.page"
            :disableJumpPage=true
            :selectedPageStyle="selectedPageStyle"
        ></yn-pagination>
        <yn-pagination
            v-on:pageSizeChange="handlePageSizeChange"
            v-on:pageChange="handlePageChange"
            :total="two.total"
            :defaultPageSize="two.pageSize"
            :defaultCurrent="two.page"
            :disablePageSize=true
        ></yn-pagination>
        <yn-pagination
            v-on:pageSizeChange="handlePageSizeChange"
            v-on:pageChange="handlePageChange"
            :total="three.total"
            :defaultPageSize="three.pageSize"
            :defaultCurrent="three.page"
        ></yn-pagination>
        <yn-pagination
            v-on:pageSizeChange="handlePageSizeChange"
            v-on:pageChange="handlePageChange"
            :total="four.total"
            :defaultPageSize="four.pageSize"
            :defaultCurrent="four.page"
        ></yn-pagination>
        <yn-pagination
            v-on:pageSizeChange="handlePageSizeChange"
            v-on:pageChange="handlePageChange"
            :total="five.total"
            :defaultPageSize="five.pageSize"
            :defaultCurrent="five.page"
        ></yn-pagination>
    </div>
</template>
<script type="text/javascript">
export default {
    name: "YnPaginationPage",
    data() {
        return {
            one: {
                total: 50,
                pageSize: 10,
                page: 4,
            },
            two: {
                total: 70,
                pageSize: 10,
                page: 6
            },
            three: {
                total: 100,
                pageSize: 10,
                page: 3
            },
            four: {
                total: 100,
                pageSize: 10,
                page: 7
            },
            five: {
                total: 20000,
                pageSize: 50,
                page: 15
            },
            selectedPageStyle: {
                background: "#0158BA",
                color: "white",
                border: "none"
            }
        };
    },
    methods: {
        handlePageSizeChange(pageSize) {
            console.log(pageSize);
        },
        handlePageChange(page) {
            console.log(page);
        }
    }
    };
</script>