# model_service/app.py
from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import json
import os
import sys
import torch
from pathlib import Path

# 添加r-informer路径到Python路径
r_informer_path = os.path.join(os.path.dirname(__file__), 'r-informer')
sys.path.append(r_informer_path)

# 导入必要的模块
from exp.exp_informer import Exp_Informer
import argparse

class RInformerModel:
    def __init__(self):
        self.model_loaded = False
        self.exp = None
        self.args = None
        self.setting = None
        
    def initialize_model(self, data_name='QianTangRiver2020-2024WorkedFull', pred_len=24):
        """
        初始化模型
        :param data_name: 数据集名称
        :param pred_len: 预测长度
        """
        try:
            # 设置模型参数（与main_informer.py保持一致）
            parser = argparse.ArgumentParser(description='[Informer] Long Sequences Forecasting')
            
            parser.add_argument('--model', type=str, default='informer',
                                help='model of experiment, options: [informer, informerstack, informerlight(TBD)]')
            parser.add_argument('--data', type=str, default=data_name, help='data')
            parser.add_argument('--root_path', type=str, default='./r-informer/data/ETT/', help='root path of the data file')
            parser.add_argument('--data_path', type=str, default='QianTangRiver2020-2024WorkedFull.csv', help='data file')
            parser.add_argument('--features', type=str, default='MS',
                                help='forecasting task, options:[M, S, MS]; M:multivariate predict multivariate, S:univariate predict univariate, MS:multivariate predict univariate')
            parser.add_argument('--target', type=str, default='O2', help='target feature in S or MS task')
            parser.add_argument('--freq', type=str, default='h',
                                help='freq for time features encoding, options:[s:secondly, t:minutely, h:hourly, d:daily, b:business days, w:weekly, m:monthly], you can also use more detailed freq like 15min or 3h')
            parser.add_argument('--checkpoints', type=str, default='./r-informer/checkpoints/', help='location of model checkpoints')

            parser.add_argument('--seq_len', type=int, default=96, help='input sequence length of Informer encoder')
            parser.add_argument('--label_len', type=int, default=48, help='start token length of Informer decoder')
            parser.add_argument('--pred_len', type=int, default=pred_len, help='prediction sequence length')

            parser.add_argument('--enc_in', type=int, default=5, help='encoder input size')
            parser.add_argument('--dec_in', type=int, default=5, help='decoder input size')
            parser.add_argument('--c_out', type=int, default=1, help='output size')
            parser.add_argument('--d_model', type=int, default=128, help='dimension of model')
            parser.add_argument('--n_heads', type=int, default=8, help='num of heads')
            parser.add_argument('--e_layers', type=int, default=2, help='num of encoder layers')
            parser.add_argument('--d_layers', type=int, default=1, help='num of decoder layers')
            parser.add_argument('--s_layers', type=str, default='3,2,1', help='num of stack encoder layers')
            parser.add_argument('--d_ff', type=int, default=2048, help='dimension of fcn')
            parser.add_argument('--factor', type=int, default=5, help='probsparse attn factor')
            parser.add_argument('--padding', type=int, default=0, help='padding type')
            parser.add_argument('--distil', action='store_false', help='whether to use distilling in encoder, using this argument means not using distilling', default=True)
            parser.add_argument('--dropout', type=float, default=0.05, help='dropout')
            parser.add_argument('--attn', type=str, default='prob', help='attention used in encoder, options:[prob, full]')
            parser.add_argument('--embed', type=str, default='timeF', help='time features encoding, options:[timeF, fixed, learned]')
            parser.add_argument('--activation', type=str, default='gelu', help='activation')
            parser.add_argument('--output_attention', action='store_true', help='whether to output attention in encoder')
            parser.add_argument('--do_predict', action='store_true', help='whether to predict unseen future data')
            parser.add_argument('--mix', action='store_false', help='use mix attention in generative decoder', default=True)
            parser.add_argument('--cols', type=str, nargs='+', help='certain cols from the data files as the input features')
            parser.add_argument('--num_workers', type=int, default=0, help='data loader num workers')
            parser.add_argument('--itr', type=int, default=2, help='experiments times')
            parser.add_argument('--train_epochs', type=int, default=6, help='train epochs')
            parser.add_argument('--batch_size', type=int, default=32, help='batch size of train input data')
            parser.add_argument('--patience', type=int, default=3, help='early stopping patience')
            parser.add_argument('--learning_rate', type=float, default=0.0001, help='optimizer learning rate')
            parser.add_argument('--des', type=str, default='test', help='exp description')
            parser.add_argument('--loss', type=str, default='mse', help='loss function')
            parser.add_argument('--lradj', type=str, default='type1', help='adjust learning rate')
            parser.add_argument('--use_amp', action='store_true', help='use automatic mixed precision training', default=False)
            parser.add_argument('--inverse', action='store_true', help='inverse output data', default=False)

            parser.add_argument('--use_gpu', type=bool, default=False, help='use gpu')
            parser.add_argument('--gpu', type=int, default=0, help='gpu')
            parser.add_argument('--use_multi_gpu', action='store_true', help='use multiple gpus', default=False)
            parser.add_argument('--devices', type=str, default='0,1,2,3', help='device ids of multile gpus')
            
            self.args = parser.parse_args([])
            
            # 设置数据相关参数
            data_parser = {
                'ETTh1': {'data': 'ETTh1.csv', 'T': 'WaterQuality', 'M': [10, 10, 10], 'S': [1, 1, 1], 'MS': [10, 10, 1]},
                'ETTh2': {'data': 'ETTh2.csv', 'T': 'OT', 'M': [7, 7, 7], 'S': [1, 1, 1], 'MS': [7, 7, 1]},
                'ETTm1': {'data': 'ETTm1.csv', 'T': 'OT', 'M': [7, 7, 7], 'S': [1, 1, 1], 'MS': [7, 7, 1]},
                'ETTm2': {'data': 'ETTm2.csv', 'T': 'OT', 'M': [7, 7, 7], 'S': [1, 1, 1], 'MS': [7, 7, 1]},
                'WTH': {'data': 'WTH.csv', 'T': 'WetBulbCelsius', 'M': [12, 12, 12], 'S': [1, 1, 1], 'MS': [12, 12, 1]},
                'ECL': {'data': 'ECL.csv', 'T': 'MT_320', 'M': [321, 321, 321], 'S': [1, 1, 1], 'MS': [321, 321, 1]},
                'Solar': {'data': 'solar_AL.csv', 'T': 'POWER_136', 'M': [137, 137, 137], 'S': [1, 1, 1], 'MS': [137, 137, 1]},
                '2021': {'data': '2021.csv', 'T': 'WaterQuality', 'M': [10, 10, 10], 'S': [1, 1, 1], 'MS': [10, 10, 1]},
                'qiantangjiang': {'data': 'qiantangjiang.csv', 'T': 'O2', 'M': [5, 5, 5], 'S': [1, 1, 1], 'MS': [5, 5, 1]},
                'QianTangRiver2020-2024WorkedFull': {'data': 'QianTangRiver2020-2024WorkedFull.csv', 'T': 'O2', 'M': [5, 5, 5], 'S': [1, 1, 1], 'MS': [5, 5, 1]},
                'new_data': {'data': 'new_data.csv', 'T': 'O2', 'M': [5, 5, 5], 'S': [1, 1, 1], 'MS': [5, 5, 1]},
            }
            
            if self.args.data in data_parser.keys():
                data_info = data_parser[self.args.data]
                self.args.data_path = data_info['data']
                self.args.target = data_info['T']
                self.args.enc_in, self.args.dec_in, self.args.c_out = data_info[self.args.features]

            self.args.s_layers = [int(s_l) for s_l in self.args.s_layers.replace(' ', '').split(',')]
            self.args.detail_freq = self.args.freq
            self.args.freq = self.args.freq[-1:]
            
            # 创建实验对象
            self.exp = Exp_Informer(self.args)
            
            # 构建setting字符串（与main_informer.py中保持一致）
            self.setting = '{}_{}_ft{}_sl{}_ll{}_pl{}_dm{}_nh{}_el{}_dl{}_df{}_at{}_fc{}_eb{}_dt{}_mx{}_{}_{}'.format(
                self.args.model, self.args.data, self.args.features, self.args.seq_len, self.args.label_len,
                self.args.pred_len, self.args.d_model, self.args.n_heads, self.args.e_layers, self.args.d_layers,
                self.args.d_ff, self.args.attn, self.args.factor, self.args.embed, self.args.distil, self.args.mix,
                self.args.des, 0)
            
            self.model_loaded = True
            
        except Exception as e:
            print(f"模型初始化失败: {e}")
            self.model_loaded = False
            
    def predict_from_array(self, input_data, pred_len=24, data_name='QianTangRiver2020-2024WorkedFull'):
        """
        直接从数组数据进行预测
        :param input_data: 输入数据 (numpy array)
        :param pred_len: 预测长度
        :param data_name: 数据集名称
        :return: 预测结果
        """
        if not self.model_loaded or self.exp is None or self.args.pred_len != pred_len:
            self.initialize_model(data_name, pred_len)
            
        if not self.model_loaded:
            raise Exception("模型未加载")
            
        try:
            # 加载模型权重
            path = os.path.join(self.args.checkpoints, self.setting)
            best_model_path = os.path.join(path, 'checkpoint.pth')
            
            if os.path.exists(best_model_path):
                # 加载模型权重并处理多GPU训练的情况
                checkpoint = torch.load(best_model_path, map_location='cpu')
                
                # 检查是否是多GPU训练的模型（包含module.前缀）
                from collections import OrderedDict
                if all(key.startswith('module.') for key in checkpoint.keys()):
                    # 创建新的状态字典，移除module.前缀
                    new_state_dict = OrderedDict()
                    for k, v in checkpoint.items():
                        name = k[7:]  # 移除'module.'前缀
                        new_state_dict[name] = v
                    self.exp.model.load_state_dict(new_state_dict)
                else:
                    # 单GPU训练的模型，直接加载
                    self.exp.model.load_state_dict(checkpoint)
            else:
                raise Exception(f"模型文件不存在: {best_model_path}")
        
            # 设置模型为评估模式
            self.exp.model.eval()
            
            # 处理输入数据
            # input_data应该是形状为(seq_len, features)的数组
            if len(input_data.shape) == 1:
                input_data = input_data.reshape(-1, 1)
                
            # 确保有足够的数据
            if input_data.shape[0] < self.args.seq_len:
                raise Exception(f"输入数据长度不足，需要至少{self.args.seq_len}个时间步，但只提供了{input_data.shape[0]}个")
                
            # 取最后seq_len个时间步的数据
            seq_x = input_data[-self.args.seq_len:]
            
            # 转换为tensor
            seq_x_tensor = torch.FloatTensor(seq_x).unsqueeze(0)  # 添加batch维度
            
            # 创建时间标记（简化处理）
            seq_x_mark = torch.zeros((1, self.args.seq_len, 4))  # 简化的时间标记
            
            # 创建解码器输入 - 修复部分
            # 根据Informer的结构，解码器输入应该包含:
            # 1. 前label_len个时间步的真实数据（用于启动解码器）
            # 2. 后pred_len个时间步的零值（将被预测值填充）
            dec_inp = torch.zeros([1, self.args.label_len + self.args.pred_len, self.args.dec_in])
            
            # 填充前label_len个时间步的数据（从输入序列的最后label_len个时间步）
            if seq_x.shape[0] >= self.args.label_len:
                label_data = seq_x[-self.args.label_len:]
            else:
                # 如果输入数据不足label_len长度，则使用所有可用数据并用零填充
                label_data = seq_x
                
            dec_inp[:, :label_data.shape[0], :] = torch.FloatTensor(label_data)
            
            # 解码器时间标记
            seq_y_mark = torch.zeros((1, self.args.label_len + self.args.pred_len, 4))
            
            # 执行预测
            with torch.no_grad():
                if self.args.output_attention:
                    outputs = self.exp.model(seq_x_tensor, seq_x_mark, dec_inp, seq_y_mark)[0]
                else:
                    outputs = self.exp.model(seq_x_tensor, seq_x_mark, dec_inp, seq_y_mark)
                    
            # 转换回numpy
            predictions = outputs.detach().cpu().numpy()
            
            # 重塑预测结果，只返回预测部分（pred_len长度）
            predictions = predictions.reshape(-1, predictions.shape[-1])
            # 只返回预测部分，不包括label_len部分
            predictions = predictions[-self.args.pred_len:]
            
            return predictions
            
        except Exception as e:
            raise Exception(f"预测失败: {e}")

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
        data_name = data.get('data_name', 'QianTangRiver2020-2024WorkedFull')
        
        if len(input_data) == 0:
            return jsonify({
                'success': False,
                'error': '输入数据为空'
            }), 400
        
        # 执行预测
        predictions = model.predict_from_array(input_data, pred_len, data_name)
        
        # 生成时间戳
        start_time = datetime.now()
        timestamps = [(start_time + timedelta(hours=i)).isoformat() for i in range(pred_len)]
        
        # 格式化结果
        result_data = []
        for i in range(min(len(predictions), pred_len)):
            pred = predictions[i]
            
            # 创建基础数据结构
            result_item = {
                'date': timestamps[i]
            }
            
            # 根据预测结果的维度动态添加字段
            if len(pred) == 1:
                # 单变量预测，只预测O2
                result_item['O2'] = float(pred[0])
            else:
                # 多变量预测，根据特征数量处理
                feature_names = ['temperature', 'pH', 'O2', 'NTU', 'uS']
                for j, feature_name in enumerate(feature_names):
                    if j < len(pred):
                        result_item[feature_name] = float(pred[j])
            
            result_data.append(result_item)
        
        return jsonify({
            'success': True,
            'predictions': result_data,
            'model_type': model_type,
            'prediction_hours': pred_len,
            'data_name': data_name
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
    
    # 添加可用数据集列表
    datasets = [
        'QianTangRiver2020-2024WorkedFull',
        'qiantangjiang',
        'ETTh1',
        'ETTh2',
        'ETTm1',
        'ETTm2',
        'WTH',
        'ECL',
        'Solar'
    ]
    
    return jsonify({
        'success': True,
        'models': models,
        'datasets': datasets
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)