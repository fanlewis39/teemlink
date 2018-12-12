#include "DeptUtil";
(function(){
	var table = "<table id='tab' class ='twotable' style='width: 80%'>";
	table += "<tr><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' colspan='5'><b><span style='font-size:12.0pt;font-family:宋体;'>江门污染物台账统计</span></b></td></tr>";
	table += "<tr><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'> 所属地区</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'> 污染物类型</td>";
	table += "<td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'> ﻿接收数量（kg或m﻿&sup3;）</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'> ﻿﻿运输数量（kg或m﻿&sup3;）</td>";
	table += "<td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>处置数量（kg或m﻿&sup3;）</td></tr>";
	var start = getItemValueAsString("start");
	var end = getItemValueAsString("end");
	if( start =="" ) start = "2018-11-7";
	if( end =="" ) end = "2030-11-7";
	
//下级地区
	var areas=[];
	var sql1 = "select '" + getDomainid() + "' as domainid,id as item_id from obpm.t_department where levels = 1";
	var query1 = queryBySQL(sql1);
	if( query1 != null ){
		for( var iter1 = query1.iterator();iter1.hasNext(); ){
			doc1 = iter1.next();
			var area = doc1.getItemValueAsString("id");
			areas.push(area);
		}
	}
	
	areas.push("总和");

//污染物种类
	var  types = [];
	var sql2 = "SELECT * FROM tlk_污染物库";
	var query2 = queryBySQL(sql2);
	if( query2 != null ){
		for( var iter2 = query2.iterator(); iter2.hasNext(); ){
			doc2 = iter2.next();
			var variety = doc2.getItemValueAsString("污染物");
			types.push(variety);
		}
	}

	var jieshou = [] , yunshu = [], chuzhi = [];
	var json1 = {} , json2 = {} , json3 = {};
		
//接收数据
	var j_sql = "SELECT d.SUPERIOR as item_SUPERIOR, c.domainid, c.item_污染物种类, c.item_接收数量, c.ITEM_接收日期 FROM obpm.t_department d LEFT JOIN (SELECT b.DOMAINID as domainid, a.SUPERIOR, b.item_污染物种类, sum(b.item_接收数量) as item_接收数量,b.ITEM_接收日期 FROM obpm.t_department a left join ";
	j_sql += "obpm_dirty.tlk_全过程跟踪 b on a.ID = b.item_接收单位隐藏 where b.ITEM_是否弃用 = '未弃用' and b.ITEM_接收日期 >'"+start+" ' and b.ITEM_接收日期<'"+end+"' group by a.SUPERIOR, b.ITEM_污染物种类) c ON c.SUPERIOR = d.ID WHERE c.domainid is not null";
	var j_query = queryBySQL(j_sql);	
	if( j_query != null ){
		for( var iter3 =  j_query.iterator(); iter3.hasNext(); ){
			doc3 = iter3.next();
			var district = doc3.getItemValueAsString("SUPERIOR");
			var kind1 = doc3.getItemValueAsString("污染物种类");
			var jieshou1 = doc3.getItemValueAsString("接收数量");
			json1 = {
				"area": district,
				"type": kind1,
				"value": jieshou1
			}
			jieshou.push(json1);	
			//map[district][kind] = [jieshou,yunshu,chuzhi];	
		}
	}
	
//运输数据
	var y_sql = "SELECT d.SUPERIOR as item_SUPERIOR, c.domainid, c.item_污染物种类, c.item_运输数量, c.ITEM_运输日期 FROM obpm.t_department d LEFT JOIN (SELECT b.DOMAINID as domainid, a.SUPERIOR, b.item_污染物种类, sum(b.item_运输数量) as item_运输数量,b.ITEM_运输日期 FROM obpm.t_department a left join ";
	y_sql += "obpm_dirty.tlk_全过程跟踪 b on a.ID = b.item_接收单位隐藏 where b.ITEM_是否弃用 = '未弃用' and b.ITEM_运输日期 >'"+start+" ' and b.ITEM_运输日期<'"+end+"' group by a.SUPERIOR, b.ITEM_污染物种类) c ON c.SUPERIOR = d.ID WHERE c.domainid is not null";
	var y_query = queryBySQL(y_sql);
	if( y_query != null ){
		for( var iter4 = y_query.iterator(); iter4.hasNext(); ){
			doc4 = iter4.next();
			var district = doc4.getItemValueAsString("SUPERIOR");
			var kind1 = doc4.getItemValueAsString("污染物种类");
			var yunshu1 = doc4.getItemValueAsString("运输数量");
			json2 = {
				"area": district,
				"type": kind1,
				"value": yunshu1
			}
			yunshu.push(json2);		
		}
	}
	
//处置数据
	var c_sql = "SELECT d.SUPERIOR as item_SUPERIOR, c.domainid, c.item_污染物种类, c.item_处置接收数量, c.ITEM_处置接收日期 FROM obpm.t_department d LEFT JOIN (SELECT b.DOMAINID as domainid, a.SUPERIOR, b.item_污染物种类, sum(b.item_处置接收数量) as item_处置接收数量,b.ITEM_处置接收日期 FROM obpm.t_department a left join ";
	c_sql += "obpm_dirty.tlk_全过程跟踪 b on a.ID = b.item_接收单位隐藏 where b.ITEM_是否弃用 = '未弃用' and b.ITEM_处置接收日期 >'"+start+" ' and b.ITEM_处置接收日期<'"+end+"' group by a.SUPERIOR, b.ITEM_污染物种类) c ON c.SUPERIOR = d.ID WHERE c.domainid is not null";
	var c_query = queryBySQL(c_sql);
	if( y_query != null ){
		for( var iter5 = c_query.iterator(); iter5.hasNext(); ){
			doc5 = iter5.next();
			var district = doc5.getItemValueAsString("SUPERIOR");
			var kind1 = doc5.getItemValueAsString("污染物种类");
			var chuzhi1 = doc5.getItemValueAsString("处置接收数量");
			json3 = {
				"area": district,
				"type": kind1,
				"value": chuzhi1
			}
			chuzhi.push(json3);		
		}
	}
		
	var map = {};//最后插入表格格式
//数据处理	
	function  zip1(arr){
		for (var i in arr){
			var area = arr[i].area;
			var type = arr[i].type;
			if (typeof map[area] === 'undefined') map[area] = {};
			if (typeof map[area][type] === 'undefined') map[area][type] = [0, 0, 0];
			map[area][type][0] = arr[i].value;
		}
	}
	
	function  zip2(arr){
		for (var i in arr){
			var area = arr[i].area;
			var type = arr[i].type;
			if (typeof map[area] === 'undefined') map[area] = {};
			if (typeof map[area][type] === 'undefined') map[area][type] = [0, 0, 0];
			map[area][type][1] = arr[i].value;
		}
	}
	
	function  zip3(arr){
		for (var i in arr){
			var area = arr[i].area;
			var type = arr[i].type;
			if (typeof map[area] === 'undefined') map[area] = {};
			if (typeof map[area][type] === 'undefined') map[area][type] = [0, 0, 0];
			map[area][type][2] = arr[i].value;
		}
	}
	zip1(jieshou);
	zip2(yunshu);
	zip3(chuzhi);
	
	//求和
	var total = {};
	types.map(function(value) {
		total[value] = [0,0,0];
	});

	for(var i = 0; i <areas.length; ++i) {
		var area = areas[i];
		for (var j = 0; j < types.length; ++j){ 
			var type = types[j];
			if (i !== areas.length - 1){
				if (j == 0){
					if (map[area]  && map[area][type]){
						table += "<tr ><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%' rowspan='"+types.length+"'>" + getDeptNameById(areas[i]) + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>" + type + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'> " + map[area][type][0] + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>" + map[area][type][1] + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>" + map[area][type][2] + "</td></tr>";
					}else if( area != '总和' ){
						table += "<tr ><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%' rowspan='"+types.length+"'>" + getDeptNameById(areas[i]) + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>" + type + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>0</td ><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>0</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>0</td></tr>";
					}
				}else{
					if (map[area]  && map[area][type]){
						table += "<tr><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>" + type + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'> " + map[area][type][0] + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>" + map[area][type][1] + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>" + map[area][type][2] + "</td></tr>";
					}else if( area != '总和' ){
						table += "<tr><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>" + type + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>0</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>0</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>0</td></tr>";
					}
				}
				 if( map[area]  && map[area][type] ){
		    			total[type][0] += map[area][type][0]*1;
		    			total[type][1] += map[area][type][1]*1;
		     		   	total[type][2] += map[area][type][2]*1;
	        			}
			}else{
				if(j == 0){
					table += "<tr ><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%' rowspan='"+types.length+"'>合计</br>(江门市)</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>" + type + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'> " + total[type][0] + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>" + total[type][1] + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>" + total[type][2] + "</td></tr>";
				}else{
					table += "<tr><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>" + type + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'> " + total[type][0] + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>" + total[type][1] + "</td><td style='border: 1px solid rgb(180, 204, 238); text-align: center;' width='20%'>" + total[type][2] + "</td></tr>";
				}	
			}				
    	}	
	}
			
	table += "</table>";
	return table;
})()