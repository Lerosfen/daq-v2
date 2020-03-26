/**
 *
 *
 */
Mock.mock(wwwroot + '/pedigree/relation', "get", function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data: {
            "name": "flare",
            "children": [
                {
                    "name": "analytics",
                    "children": [
                        {
                            "name": "cluster",
                            "children": [
                                { "name": "AgglomerativeCluster", "size": 3938 },
                                { "name": "CommunityStructure", "size": 3812 },
                                { "name": "HierarchicalCluster", "size": 6714 },
                                { "name": "MergeEdge", "size": 743 }
                            ]
                        },
                        {
                            "name": "graph",
                            "children": [
                                { "name": "BetweennessCentrality", "size": 3534 },
                                { "name": "LinkDistance", "size": 5731 },
                                { "name": "MaxFlowMinCut", "size": 7840 },
                                { "name": "ShortestPaths", "size": 5914 },
                                { "name": "SpanningTree", "size": 3416 }
                            ]
                        },
                        {
                            "name": "optimization",
                            "children": [
                                { "name": "AspectRatioBanker", "size": 7074 }
                            ]
                        }
                    ]
                }
            ]
        }
    };
})
/**
 *数据表类型
 */
Mock.mock(wwwroot + '/DataTable/type', "get", function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data: ["请选择","采集目标表","清洗目标表","融合目标表"]
    };
})
/**
 *数据表
 */
Mock.mock(wwwroot + '/Data/sheet', "get", function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data: [["请选择"],["采集目标表1","采集目标表2","采集目标表3","采集目标表4"],
            ["清洗目标表1","清洗目标表2","清洗目标表3","清洗目标表4"],
            ["融合目标表1","融合目标表2","融合目标表3","融合目标表4"]],
    };
})
/**
 *关系图
 */
Mock.mock(RegExp(wwwroot + '/ForceDiagram/data/'+ ".*"),"get",function(TableName) {
    var TableName = TableName.url.match(/TableName=(\S*)/)[1];
    return {
        "nodes":[
            { "name": "table_user", "image" : "/resources/img/Forced/1.png","Primary":"0"},
            { "name": "name", "image" : "/resources/img/Forced/2.png","Primary":"1" },
            { "name": "IDCard", "image" : "/resources/img/Forced/2.png","Primary":"2" },
            { "name": "age", "image" : "/resources/img/Forced/2.png","Primary":"3" },
            { "name": "address", "image" : "/resources/img/Forced/2.png","Primary":"4" },
            { "name": "Education", "image" : "/resources/img/Forced/2.png","Primary":"5" },
            { "name": "公安人口表" , "image" : "/resources/img/Forced/3.png","Primary":"6" },
            { "name": "学历表", "image" : "/resources/img/Forced/3.png","Primary":"7" },
            { "name": "公安人口库", "image" : "/resources/img/Forced/4.png","Primary":"8" },
            { "name": "教育局数据库", "image" : "/resources/img/Forced/4.png","Primary":"9" }
        ],
        "edges":[
            { "source": 0 , "target": 1 , "relation":"关联" },
            { "source": 0 , "target": 2 , "relation":"关联" },
            { "source": 0 , "target": 3 , "relation":"关联" },
            { "source": 0 , "target": 4 , "relation":"关联" },
            { "source": 0 , "target": 5 , "relation":"关联" },
            { "source": 1 , "target": 6 , "relation":"关联" },
            { "source": 2 , "target": 6 , "relation":"关联" },
            { "source": 3 , "target": 7 , "relation":"关联" },
            { "source": 4 , "target": 7 , "relation":"关联" },
            { "source": 5 , "target": 7 , "relation":"关联" },
            { "source": 6 , "target": 8 , "relation":"关联" },
            { "source": 7 , "target": 9 , "relation":"关联" }
        ]
    }
})