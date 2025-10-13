# model_service/app.py
from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import json
import os

# 模拟R-Informer模型 - 实际使用时替换为真实的模型加载代码
class RInformerModel:
    def __init__(self):
        self.model_loaded = True
    
    def predict(self, data, pred_len=24):
        """
        模拟预测功能
        :param data: 输入数据 (numpy array)
        :param pred_len: 预测长度
        :return: 预测结果
        """
        # 模拟预测逻辑 - 实际应使用真实的R-Informer模型
        # 这里只是示例，实际应该加载真实的模型并进行预测
        last_values = data[-1] if len(data) > 0 else [20, 7.0, 8.0, 5.0, 1000]
        
        predictions = []
        for i in range(pred_len):
            # 简单的模拟预测，实际应使用模型预测
            pred = [
                last_values[0] + np.random.normal(0, 0.5),  # temperature
                last_values[1] + np.random.normal(0, 0.1),  # pH
                last_values[2] + np.random.normal(0, 0.3),  # O2
                last_values[3] + np.random.normal(0, 0.5),  # NTU
                last_values[4] + np.random.normal(0, 20)    # uS
            ]
            predictions.append(pred)
            last_values = pred
            
        return np.array(predictions)

# 初始化模型
model = RInformerModel()

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'OK',
        'model_loaded': model.model_loaded,
        'service': 'R-Informer Water Quality Prediction Service'
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # 获取请求数据
        data = request.json
        input_data = np.array(data.get('input_data', []))
        pred_len = data.get('prediction_hours', 24)
        model_type = data.get('model_type', 'R-Informer')
        
        if len(input_data) == 0:
            return jsonify({
                'success': False,
                'error': '输入数据为空'
            }), 400
        
        # 执行预测
        predictions = model.predict(input_data, pred_len)
        
        # 生成时间戳
        start_time = datetime.now()
        timestamps = [(start_time + timedelta(hours=i)).isoformat() for i in range(pred_len)]
        
        # 格式化结果
        result_data = []
        for i, pred in enumerate(predictions):
            result_data.append({
                'date': timestamps[i],
                'temperature': float(pred[0]),
                'pH': float(pred[1]),
                'O2': float(pred[2]),
                'NTU': float(pred[3]),
                'uS': float(pred[4])
            })
        
        return jsonify({
            'success': True,
            'predictions': result_data,
            'model_type': model_type,
            'prediction_hours': pred_len
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/models', methods=['GET'])
def get_models():
    """获取可用模型列表"""
    models = [
        {
            'name': 'R-Informer',
            'versions': [
                {'label': '水质预测 R-Informer v1.0', 'value': 'r_informer_v1_0', 'accuracy': '95.2%', 'trainDate': '2024-08-10'},
                {'label': '水质预测 R-Informer best_model', 'value': 'r_informer_best', 'accuracy': '96.8%', 'trainDate': '2024-08-12'},
                {'label': '水质预测 R-Informer checkpoint_100', 'value': 'r_informer_cp100', 'accuracy': '94.5%', 'trainDate': '2024-08-08'}
            ]
        }
    ]
    
    return jsonify({
        'success': True,
        'models': models
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)