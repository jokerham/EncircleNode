// ============================================================================
// src/modules/menu/admin/list/MenuTreePanel.tsx
// ============================================================================

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Tree, type NodeRendererProps } from 'react-arborist';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { type MenuTreeResponse } from '../../../../api/menuApi';

interface MenuTreePanelProps {
  menuData: MenuTreeResponse[];
  selectedMenu: MenuTreeResponse | null;
  onSelectMenu: (menu: MenuTreeResponse) => void;
}

export const MenuTreePanel: React.FC<MenuTreePanelProps> = ({
  menuData,
  selectedMenu,
  onSelectMenu,
}) => {
  const handleSelect = (nodes: { data: MenuTreeResponse }[]) => {
    if (nodes.length > 0) {
      onSelectMenu(nodes[0].data);
    }
  };

  const Node = ({ node, style, dragHandle }: NodeRendererProps<MenuTreeResponse>) => {
    const isSelected = selectedMenu?._id === node.data._id;

    return (
      <div
        style={style}
        ref={dragHandle}
        onClick={() => onSelectMenu(node.data)}
        className={`tree-node ${isSelected ? 'selected' : ''}`}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 8px',
            cursor: 'pointer',
            backgroundColor: isSelected ? 'primary.light' : 'transparent',
            color: isSelected ? 'primary.contrastText' : 'inherit',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: isSelected ? 'primary.light' : 'action.hover',
            },
          }}
        >
          <Box
            sx={{ mr: 1, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              node.toggle();
            }}
          >
            {node.children && node.children.length > 0 && (
              node.isOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />
            )}
          </Box>
          <Typography variant="body2">{node.data.title}</Typography>
          {!node.data.isActive && (
            <Typography
              variant="caption"
              sx={{ ml: 1, opacity: 0.6, fontStyle: 'italic' }}
            >
              (inactive)
            </Typography>
          )}
        </Box>
      </div>
    );
  };

  return (
    <Paper sx={{ flex: '0 0 350px', p: 2, overflow: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Menu Structure
      </Typography>
      <Box sx={{ height: 'calc(100% - 50px)', overflow: 'hidden' }}>
        {menuData.length > 0 ? (
          <Tree
            data={menuData}
            openByDefault={false}
            width={318}
            height={500}
            indent={24}
            rowHeight={36}
            onSelect={handleSelect}
          >
            {Node}
          </Tree>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No menu items found. Click "Add Menu Item" to create one.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};